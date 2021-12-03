# Browser Command

## Usage

`yarn install`

`yarn workspace client start`

```javascript
// App.js

const App = () => {
    const { players } = useStore()

    return (
        <>
        { players.map((player) => <PlayerProvider value={player}><Player >  <Unit/></Player></PlayerProvider>) }
        </>
    )
}

const PlayerContext = createContext()

export { PlayerProvider: PlayerContext.Provider }

export const usePlayer() {
    return useContext(PlayerContext)
}

// Player.js
const Player = () => {
    const { entities } = usePlayer()

    for (const entitiy of entities) {
        const Component = entities.get(entity.type)

        <Component {...entity.props} />
    }
}

// Unit.js

const Unit = ({ model }) => {
    const player = usePlayer() // Access the owning player

    // const mesh = useGLTF()
    // ... render components (position, rotation, scale, ...)
 }

entities.register('unit', Unit)
```
