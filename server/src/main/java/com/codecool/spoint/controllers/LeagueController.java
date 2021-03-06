package com.codecool.spoint.controllers;

import com.codecool.spoint.models.League;
import com.codecool.spoint.services.LeagueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/leagues")
@CrossOrigin(origins = "http://localhost:3000")
public class LeagueController {

    private final LeagueService leagueService;

    @Autowired
    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @GetMapping
    public List<League> getAllLeagues() {
        return leagueService.getAllLeagues();
    }

    @GetMapping("/{id}")
    public Optional<League> getLeagueById(@PathVariable("id") Long id) {
        return leagueService.getLeagueById(id);
    }

    @PutMapping("/update/{id}")
    public String updateLeagueName(@PathVariable("id") Long id,@RequestBody League league) {
        return leagueService.updateLeagueName(id, league);
    }

    @PostMapping("/add/{creator_id}")
    public String addLeague(@RequestBody League league, @PathVariable("creator_id")Long creator_id) {
        return leagueService.addLeague(league, creator_id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteLeague(@PathVariable("id") Long id) {
        return leagueService.deleteLeague(id);
    }


    @PostMapping("/add-member/{league_id}/{player_id}")
    public String addLeagueMember(@PathVariable("league_id") Long leagueId, @PathVariable("player_id") Long playerId) {
        return leagueService.addLeagueMember(leagueId, playerId);
    }

    @DeleteMapping("/delete-member/{league_id}/{player_id}")
    public void deleteLeagueMember(@PathVariable("league_id") Long leagueId, @PathVariable("player_id") Long playerId) {
        leagueService.deleteLeagueMember(leagueId, playerId);
    }

    @PutMapping("/update-league-score/{id}")
    public void updateLeagueScore(@PathVariable("id") Long id, @RequestBody Long score) {
        leagueService.updateScore(id, score);
    }

}

