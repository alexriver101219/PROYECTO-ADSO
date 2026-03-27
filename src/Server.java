import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.regex.Pattern;

public class Server {
    private static final String ROOT_DIR = System.getProperty("user.dir");
    private static final String USERS_FILE = ROOT_DIR + "/users.json";
    private static Map<String, User> users = new ConcurrentHashMap<>();
    private static final String SECRET_KEY = "your-secret-key-change-in-production"; // Cambia esto en producción
    private static final long TOKEN_EXPIRY = 3600000; // 1 hora en ms

    static class User {
        String fullname, email, password, role, company;
        boolean publicacion;

        User(String fullname, String email, String password, String role, String company, boolean publicacion) {
            this.fullname = fullname;
            this.email = email;
            this.password = password;
            this.role = role;
            this.company = company;
            this.publicacion = publicacion;
        }
    }

    public static void main(String[] args) throws IOException {
        loadUsers();
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new StaticFileHandler());
        server.createContext("/register", new RegisterHandler());
        server.createContext("/login", new LoginHandler());
        server.createContext("/api/profile", new ProfileHandler()); // New endpoint for token validation
        server.setExecutor(null);
        server.start();
        System.out.println("Servidor iniciado en http://localhost:8080");
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/landing.html";
            Path filePath = Paths.get(ROOT_DIR, path);
            if (Files.exists(filePath) && !Files.isDirectory(filePath)) {
                String contentType = getContentType(path);
                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.sendResponseHeaders(200, Files.size(filePath));
                try (OutputStream os = exchange.getResponseBody();
                     InputStream is = Files.newInputStream(filePath)) {
                    is.transferTo(os);
                }
            } else {
                exchange.sendResponseHeaders(404, 0);
                exchange.getResponseBody().close();
            }
        }

        private String getContentType(String path) {
            if (path.endsWith(".html")) return "text/html";
            if (path.endsWith(".css")) return "text/css";
            if (path.endsWith(".js")) return "application/javascript";
            if (path.endsWith(".png")) return "image/png";
            if (path.endsWith(".jpg")) return "image/jpeg";
            return "text/plain";
        }
    }

    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, 0);
                exchange.getResponseBody().close();
                return;
            }
            Map<String, String> params = parseFormData(exchange);
            String fullname = params.get("fullname");
            String email = params.get("email");
            String password = params.get("password");
            String confirm = params.get("confirm");
            String role = params.get("role");
            String company = params.get("company");
            boolean publicacion = "on".equals(params.get("publicacion"));
            boolean terms = "on".equals(params.get("terms"));

            String response;
            if (fullname == null || email == null || password == null || !terms || !password.equals(confirm) || users.containsKey(email)) {
                response = "{\"success\": false, \"message\": \"Datos inválidos o usuario ya existe\"}";
            } else {
                users.put(email, new User(fullname, email, hashPassword(password), role, company, publicacion));
                saveUsers();
                String token = generateJWT(email);
                response = "{\"success\": true, \"message\": \"Registro exitoso\", \"token\": \"" + token + "\", \"user\": {\"fullname\": \"" + fullname + "\", \"email\": \"" + email + "\", \"role\": \"" + role + "\"}}";
            }
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, 0);
                exchange.getResponseBody().close();
                return;
            }
            Map<String, String> params = parseFormData(exchange);
            String email = params.get("email");
            String password = params.get("password");

            String response;
            User user = users.get(email);
            if (user != null && verifyPassword(password, user.password)) {
                String token = generateJWT(email);
                response = "{\"success\": true, \"message\": \"Login exitoso\", \"token\": \"" + token + "\", \"user\": {\"fullname\": \"" + user.fullname + "\", \"email\": \"" + user.email + "\", \"role\": \"" + user.role + "\"}}";
            } else {
                response = "{\"success\": false, \"message\": \"Credenciales inválidas\"}";
            }
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }

    private static Map<String, String> parseFormData(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String body = sb.toString();
            // Try to parse as JSON
            if (body.startsWith("{")) {
                // Simple JSON parser for this case
                Map<String, String> params = new HashMap<>();
                body = body.trim().substring(1, body.length() - 1); // remove {}
                String[] pairs = body.split(",");
                for (String pair : pairs) {
                    String[] keyValue = pair.split(":", 2);
                    if (keyValue.length == 2) {
                        String key = keyValue[0].trim().replaceAll("\"", "");
                        String value = keyValue[1].trim().replaceAll("\"", "");
                        params.put(key, value);
                    }
                }
                return params;
            } else {
                // Fallback to form data
                Map<String, String> params = new HashMap<>();
                String[] pairs = body.split("&");
                for (String pair : pairs) {
                    String[] keyValue = pair.split("=", 2);
                    if (keyValue.length == 2) {
                        params.put(keyValue[0], java.net.URLDecoder.decode(keyValue[1], "UTF-8"));
                    }
                }
                return params;
            }
        }
    }

    private static void loadUsers() {
        try {
            if (Files.exists(Paths.get(USERS_FILE))) {
                String json = Files.readString(Paths.get(USERS_FILE));
                // Simple parsing, assuming format: email:fullname,email,password,role,company,publicacion\n
                String[] lines = json.split("\n");
                for (String line : lines) {
                    if (!line.trim().isEmpty()) {
                        String[] parts = line.split(",");
                        if (parts.length >= 6) {
                            users.put(parts[1], new User(parts[0], parts[1], parts[2], parts[3], parts[4], Boolean.parseBoolean(parts[5])));
                        }
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error loading users: " + e.getMessage());
        }
    }

    private static void saveUsers() {
        try (PrintWriter writer = new PrintWriter(new FileWriter(USERS_FILE))) {
            for (User user : users.values()) {
                writer.println(user.fullname + "," + user.email + "," + user.password + "," + user.role + "," + user.company + "," + user.publicacion);
            }
        } catch (IOException e) {
            System.err.println("Error saving users: " + e.getMessage());
        }
    }
}