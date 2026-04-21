package com.prismalife;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        // UserRegistry registry = new UserRegistry();
        User usr = new User(1, "arthur", "arthur@email.com");
        // registry.registerUser(usr);

        // User loggedUser = registry.findByEmail("arthur@email.com");

        int option = 0;

        do {
            System.out.println("============== Menu ==============");
            System.out.println("1. Criar nova Área da Vida (Silo)");
            System.out.println("2. Listar minhas Áreas");
            System.out.println("3. Selecionar uma Área (Adicionar Tarefas)");
            System.out.println("4. Sair");

            option = scanner.nextInt();
            scanner.nextLine();

            switch (option) {
                case 1:
                    System.out.print("Digite o nome da nova área: ");
                    String areaName = scanner.nextLine();
                    usr.createSilo(areaName);
                    break;
                case 2:
                    System.out.println("======== Suas áreas: ========");
                    for (LifeArea silo : usr.getSilos()) {
                        System.out.println(silo.getName());
                    }
                    break;
                case 3:
                    System.out.println("Digite o nome da área que deseja selecionar");
                    String search = scanner.nextLine();
                    LifeArea selectedArea = usr.getSiloByName(search);
                    int opt = 0;

                    if (selectedArea != null) {
                        do {
                            System.out.println("============== Selecione ==============");
                            System.out.println("1. Adicionar uma tarefa");
                            System.out.println("2. Listar tarefas");
                            System.out.println("3. Sair");

                            opt = scanner.nextInt();
                            scanner.nextLine();

                            switch (opt) {
                                case 1:
                                    System.out.println("Área selecionada:" + selectedArea.getName());
                                    System.out.print("Digite o título da nova tarefa: ");
                                    String content = scanner.nextLine();

                                    Task tsk = new Task(Math.abs((int) System.currentTimeMillis()), content);
                                    selectedArea.getMainTasks().addTask(tsk);
                                    System.out.println("Tarefa adicionada");

                                    break;

                                case 2:
                                    selectedArea.getMainTasks().showTasks();
                                    break;
                                case 3:
                                    break;
                                default:
                                    System.err.println("Valor inválido");
                                    break;
                            }
                        } while (opt != 3);
                    }

                    break;
                case 4:
                    System.out.println("Encerrando...");
                    break;

                default:
                    System.err.println("Valor inválido");
                    break;
            }
        } while (option != 4);
        scanner.close();
    }
}