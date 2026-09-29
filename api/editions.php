<?php
require_once '../middleware/auth.php';
header('Content-Type: application/json');

$game = $_GET['game'] ?? '';

// Simulando um banco de edições especificado nas instruções do desafio
$editions = [
    'Pokémon' => [
        ['id' => 1, 'name' => '30th Celebration'],
        ['id' => 2, 'name' => 'Pitch Black'],
        ['id' => 3, 'name' => 'Chaos Rising'],
        ['id' => 4, 'name' => 'Perfect Order'],
        ['id' => 5, 'name' => 'Ascended Heroes']
    ],
    'Magic: The Gathering' => [
        ['id' => 6, 'name' => 'The Hobbit'],
        ['id' => 7, 'name' => 'Marvel Super Heroes'],
        ['id' => 8, 'name' => 'Secrets of Strixhaven'],
        ['id' => 9, 'name' => 'Teenage Mutant Ninja Turtles'],
        ['id' => 10, 'name' => 'Lorwyn Eclipsed']
    ],
    'Yu-Gi-Oh!' => [
        ['id' => 11, 'name' => 'Magnificent Monsters'],
        ['id' => 12, 'name' => 'Chaos Origins'],
        ['id' => 13, 'name' => 'Battles of Legend: Glorious Gallery'],
        ['id' => 14, 'name' => 'Blazing Dominion'],
        ['id' => 15, 'name' => 'Rarity Collection 5']
    ]
];

if ($game === 'all') {
    echo json_encode($editions);
} elseif (array_key_exists($game, $editions)) {
    // Simulando o delay de uma query ou API externa para visualizar o estado de "loading" no frontend
    usleep(500000); // 0.5s de delay
    echo json_encode($editions[$game]);
} else {
    echo json_encode([]);
}
