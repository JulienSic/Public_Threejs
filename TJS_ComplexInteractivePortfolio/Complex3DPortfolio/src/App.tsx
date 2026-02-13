import { Canvas } from '@react-three/fiber'
import { Scene } from './Components/Models'

function App() {
  return (
      <div className="h-screen">
          <Canvas>
              <Scene />
          </Canvas>
      </div>
  )
}

export default App
