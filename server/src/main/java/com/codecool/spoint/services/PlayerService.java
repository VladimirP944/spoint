package com.codecool.spoint.services;

import com.codecool.spoint.models.Player;
import com.codecool.spoint.repositories.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAllByOrderByIdAsc();
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public void addPlayer(Player player) {
        playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    public void updatePlayer(Long id, Map<String, Object> updates) {
        Optional<Player> playerToFind = playerRepository.findById(id);

        if (playerToFind.isPresent()) {
            Player playerToUpdate = playerToFind.get();

            updates.forEach((key, value) -> {
                Field field = ReflectionUtils.findField(Player.class, key);
                    field.setAccessible(true);
                    ReflectionUtils.setField(field, playerToUpdate, value);
            });
            playerRepository.save(playerToUpdate);
        }
    }

    public boolean checkLogin(Player player) {
        List<Player> players = getAllPlayers();

        for (Player checkPlayer : players) {
            if (checkPlayer.getEmail().equals(player.getEmail()) &&
                    checkPlayer.getPassword().equals(player.getPassword())) {
                return true;
            }
        }
        return false;
    }
}
