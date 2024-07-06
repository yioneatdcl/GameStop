export enum SERVER_MESSAGE_TYPES {
    
    PLAYER_JOINED = 'player_joined',
    PLAYER_LEFT = 'played_left',

    CLAIM_SPOT = 'claim_spot',
    SPOT_CLAIMED = 'spot_claimed',
    OUT = 'out',
    SHOW_EVICTOR = 'setup_evictor',
    LEADERBOARDS_UPDATES = 'leaderboards_updates',
    RESET_GAME = 'reset_game',
    EVICT = 'evict',
    EVICTION_TRIGGERED = 'eviction_triggered'
}

export enum GAME_ROOM_STATUS {
    WAITING_TO_START = 'waiting_to_start',
    WAITING_FOR_PLAYERS = 'waiting_for_players',
    STARTING_SOON = 'starting_soon',
    IN_PROGRESS = 'in_progress',
    GAME_ENDED = 'game_ended'
}
