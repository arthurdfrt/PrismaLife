import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        UserRegistry registry = new UserRegistry();
        User u1 = new User(1, "arthur", "arthur@email.com");
        registry.registerUser(u1);

        User loggedUser = registry.findByEmail("arthur@email.com");
    }
}