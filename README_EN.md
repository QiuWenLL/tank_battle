# Tank Battle Game

A classic tank battle game developed with HTML5 Canvas and JavaScript.

## Game Features

🎮 **Classic Gameplay**
- Classic tank battle gaming experience
- Player vs AI enemy tanks
- Real-time shooting and movement

🎯 **Game Functions**
- Player tank control (WASD or arrow keys for movement, automatic shooting while moving)
- AI enemy tanks (automatic movement and shooting)
- Collision detection system
- Destructible obstacle system
- Scoring and life system
- Level progression system

🎨 **Visual Effects**
- Modern UI design
- Cool gradient colors
- Real-time game status display
- Responsive design supporting multiple screen sizes
- Particle effects for destroyed obstacles

🔊 **Audio System**
- Dynamic sound effects using Web Audio API
- Shooting sound effects
- Impact/explosion sound effects
- Obstacle destruction sound effects
- Toggle sound on/off functionality

## Game Controls

### Keyboard Controls
- **W/↑**: Move forward
- **S/↓**: Move backward  
- **A/←**: Turn left
- **D/→**: Turn right
- **Movement**: Automatic shooting while moving
- **P**: Pause/Resume game
- **R**: Restart game

### Mouse Controls
- Click buttons to control game state
- 🔊 button to toggle sound effects

## Game Rules

1. **Objective**: Eliminate all enemy tanks and achieve the highest score possible
2. **Lives**: Player has 3 lives, loses one life when hit by enemy bullets
3. **Scoring**: 
   - Destroy enemy tank: 100 points
   - Destroy obstacle: 10 points
   - Complete level: 500 points
4. **Levels**: After eliminating all enemy tanks, advance to next level with more enemies
5. **Game Over**: Game ends when lives reach zero

## Gameplay Features

### Enhanced Combat System
- **High-Speed Shooting**: Player tank fires 10x faster than enemy tanks (100ms vs 1000ms cooldown)
- **Automatic Firing**: Tank automatically shoots while moving - just control the direction!
- **Smart AI**: Enemy tanks patrol, aim at player, and avoid obstacles

### Interactive Environment
- **Destructible Obstacles**: Player bullets can destroy obstacles, creating new tactical opportunities
- **Visual Feedback**: Destroyed obstacles create particle debris effects
- **Strategic Terrain**: Choose to clear obstacles for better movement or use them as cover

### Audio Experience
- **Dynamic Sound Effects**: Procedurally generated audio using Web Audio API
- **Contextual Audio**: Different sounds for shooting, hits, and destruction
- **Audio Control**: Toggle sound effects on/off during gameplay

## Technical Features

- **Pure Vanilla JavaScript**: No external frameworks required
- **HTML5 Canvas**: High-performance 2D graphics rendering
- **Object-Oriented Design**: Clean and maintainable code architecture
- **Real-time Collision Detection**: Precise physics collision system
- **AI System**: Intelligent enemy tank behavior
- **Particle System**: Visual effects for enhanced gameplay experience
- **Web Audio API**: Dynamic sound generation without external audio files

## File Structure

```
tank_battle/
├── index.html      # Main HTML file
├── style.css       # Stylesheet
├── game.js         # Game logic and classes
├── sounds.js       # Audio management system
├── README.md       # Documentation (Chinese)
└── README_EN.md    # Documentation (English)
```

## How to Run

1. Download or clone the project to local machine
2. Open `index.html` directly in your web browser
3. Click "开始游戏" (Start Game) button to begin

**No server setup required** - runs entirely in the browser!

## Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Other modern browsers supporting HTML5 Canvas and Web Audio API

## Technical Architecture

### Main Classes

#### TankBattleGame Class
- Main game controller
- Handles game state, input, updates, and rendering
- Manages all game objects and systems

#### Tank Class
- Tank objects (player and enemy)
- Movement, shooting, and AI behavior
- Collision detection and physics

#### Bullet Class
- Projectile objects
- Movement and rendering
- Different behaviors for player vs enemy bullets

#### Obstacle Class
- Destructible barrier objects
- Block movement and projectiles
- Can be destroyed by player bullets

#### Particle Class
- Visual effect system
- Debris effects when obstacles are destroyed
- Automatic lifecycle management

#### SoundManager Class
- Audio system management
- Procedural sound generation
- Sound effect control and playback

## Game Mechanics

### Combat System
- **Player Advantage**: 10x faster firing rate than enemies
- **Auto-Shooting**: Eliminates need for manual shooting - focus on movement and tactics
- **Collision System**: Precise hit detection for tanks, bullets, and obstacles

### Level Progression
- **Dynamic Difficulty**: Each level increases enemy count
- **Score Multipliers**: Different point values for different targets
- **Endless Gameplay**: Levels continue indefinitely with increasing challenge

### Environmental Interaction
- **Destructible Terrain**: Create new paths by destroying obstacles
- **Tactical Decisions**: Balance between clearing obstacles and using them for protection
- **Visual Feedback**: Particle effects provide satisfying destruction visuals

## Development Features

### Code Quality
- **Modular Design**: Separate classes for different game components
- **Event-Driven**: Clean separation of input handling and game logic
- **Performance Optimized**: Efficient rendering and collision detection

### Extensibility
- **Easy to Modify**: Clear class structure makes adding new features simple
- **Configurable**: Game parameters easily adjustable
- **Scalable**: Architecture supports additional game modes and features

## Future Enhancement Ideas

- [ ] ✅ ~~Audio system~~ (Completed)
- [ ] ✅ ~~Destructible obstacles~~ (Completed)
- [ ] Multiple tank types with different abilities
- [ ] Power-up system (speed boost, shield, multi-shot)
- [ ] Map editor for custom levels
- [ ] Multiplayer support
- [ ] High score persistence
- [ ] Different weapon types
- [ ] Boss battles
- [ ] Campaign mode with story

## Performance

- **Smooth 60 FPS**: Optimized rendering loop
- **Efficient Collision Detection**: Smart algorithms prevent performance issues
- **Memory Management**: Automatic cleanup of expired objects
- **Scalable Rendering**: Handles multiple objects without frame drops

## Accessibility

- **Keyboard Navigation**: Full game control via keyboard
- **Visual Feedback**: Clear visual indicators for all game states
- **Audio Toggle**: Option to disable sounds for accessibility
- **Responsive Design**: Works on different screen sizes

## Developer Information

This is an educational and entertainment project demonstrating how to develop 2D games using vanilla JavaScript. The code structure is clean, well-documented, and easy to understand and extend.

**Perfect for:**
- Learning game development concepts
- Understanding HTML5 Canvas
- Exploring Web Audio API
- JavaScript object-oriented programming
- Real-time game mechanics

## Getting Started for Developers

1. **Study the Code Structure**: Start with `game.js` to understand the main game loop
2. **Examine Classes**: Each class handles a specific aspect of the game
3. **Modify Parameters**: Try changing tank speed, bullet speed, or obstacle count
4. **Add Features**: Use the existing architecture to add new game mechanics
5. **Experiment**: The modular design makes it safe to experiment with changes

## License

This project is open for educational and entertainment purposes. Feel free to modify, distribute, and learn from the code.

---

**Enjoy the tank battle experience!** 🎮💥

*For Chinese documentation, see [README.md](README.md)*
