package com.prismalife;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/silos")
public class SiloController {
    private List<Silo> silos = new ArrayList<>();
    private long nextID = 1;

    public SiloController() {
        silos.add(new Silo("🎓 Faculdade", "faculdade", "#8b5cf6"));
        silos.add(new Silo("💼 Trabalho", "trabalho", "#f59e0b"));
        silos.add(new Silo("🍎 Saúde", "saude", "#10b981"));
        nextID = 4;
    }

    @GetMapping
    public List<Silo> getSilos() {
        return silos;
    }

    @PostMapping
    public Silo createSilo(@RequestBody Silo newSilo) {
        newSilo.setId(nextID++);

        silos.add(newSilo);

        System.out.println("Novo Silo Criado no Java: " + newSilo.getName());
        return newSilo;
    }
}
