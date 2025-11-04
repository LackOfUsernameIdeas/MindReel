import {useMemo} from "react"

interface DoorsProps {
    position?: string
    rotation?: string
}

export default function Doors({position = "0 0 0", rotation = "0 0 0"}: DoorsProps) {
    const materials = useMemo(
        () => ({
            darkWood: "roughness: 0.3; metalness: 0.2; color: #1a0f0a",
            brass: "roughness: 0.2; metalness: 0.9; color: #b8860b",
            glass: "roughness: 0.1; metalness: 0.1; opacity: 0.3; transparent: true; color: #2a2a2a",
            metal: "roughness: 0.3; metalness: 0.8; color: #2a2a2a",
        }),
        [],
    )

    return (
        <a-entity position={position} rotation={rotation}>
            {/* DOOR FRAME */}
            <a-entity>
                {/* Left frame */}
                <a-box position="-1 1.1 0" width="0.12" height="2.4" depth="0.15" material={materials.darkWood}></a-box>

                {/* Right frame */}
                <a-box position="1 1.1 0" width="0.12" height="2.4" depth="0.15" material={materials.darkWood}></a-box>

                {/* Top frame */}
                <a-box position="0 2.3 0" width="2.24" height="0.12" depth="0.15" material={materials.darkWood}></a-box>

                {/* Decorative top panel */}
                <a-box position="0 2.55 0.01" width="2" height="0.4" depth="0.08" material={materials.glass}></a-box>
            </a-entity>

            {/* LEFT DOOR */}
            <a-entity position="-0.5 0 0">
                {/* Door panel */}
                <a-box position="0 1.1 0.02" width="0.88" height="2.2" depth="0.08"
                       material={materials.darkWood}></a-box>

                {/* Glass window - upper */}
                <a-box position="0 1.6 0.03" width="0.6" height="0.8" depth="0.06" material={materials.glass}></a-box>

                {/* Decorative brass trim around glass */}
                <a-box position="0 1.6 0.05" width="0.64" height="0.04" depth="0.04" material={materials.brass}></a-box>
                <a-box position="0 1.2 0.05" width="0.64" height="0.04" depth="0.04" material={materials.brass}></a-box>
                <a-box position="-0.3 1.6 0.05" width="0.04" height="0.84" depth="0.04"
                       material={materials.brass}></a-box>
                <a-box position="0.3 1.6 0.05" width="0.04" height="0.84" depth="0.04"
                       material={materials.brass}></a-box>

                {/* Push bar */}
                <a-box position="0.2 1.05 0.08" width="0.5" height="0.06" depth="0.06"
                       material={materials.metal}></a-box>

                {/* Push bar mounts */}
                <a-box position="0.4 1.05 0.08" width="0.08" height="0.1" depth="0.08"
                       material={materials.metal}></a-box>
                <a-box position="0 1.05 0.08" width="0.08" height="0.1" depth="0.08" material={materials.metal}></a-box>

                {/* Decorative panel - lower */}
                <a-box
                    position="0 0.5 0.04"
                    width="0.6"
                    height="0.7"
                    depth="0.06"
                    material="roughness: 0.4; metalness: 0.3; color: #2a1810"
                ></a-box>

                {/* Brass kick plate */}
                <a-box position="0 0.15 0.065" width="0.7" height="0.25" depth="0.02"
                       material={materials.brass}></a-box>
            </a-entity>

            {/* RIGHT DOOR */}
            <a-entity position="0.5 0 0">
                {/* Door panel */}
                <a-box position="0 1.1 0.02" width="0.88" height="2.2" depth="0.08"
                       material={materials.darkWood}></a-box>

                {/* Glass window - upper */}
                <a-box position="0 1.6 0.03" width="0.6" height="0.8" depth="0.06" material={materials.glass}></a-box>

                {/* Decorative brass trim around glass */}
                <a-box position="0 1.6 0.05" width="0.64" height="0.04" depth="0.04" material={materials.brass}></a-box>
                <a-box position="0 1.2 0.05" width="0.64" height="0.04" depth="0.04" material={materials.brass}></a-box>
                <a-box position="-0.3 1.6 0.05" width="0.04" height="0.84" depth="0.04"
                       material={materials.brass}></a-box>
                <a-box position="0.3 1.6 0.05" width="0.04" height="0.84" depth="0.04"
                       material={materials.brass}></a-box>

                {/* Push bar */}
                <a-box position="-0.2 1.05 0.08" width="0.5" height="0.06" depth="0.06"
                       material={materials.metal}></a-box>

                {/* Push bar mounts */}
                <a-box position="-0.4 1.05 0.08" width="0.08" height="0.1" depth="0.08"
                       material={materials.metal}></a-box>
                <a-box position="0 1.05 0.08" width="0.08" height="0.1" depth="0.08" material={materials.metal}></a-box>

                {/* Decorative panel - lower */}
                <a-box
                    position="0 0.5 0.04"
                    width="0.6"
                    height="0.7"
                    depth="0.06"
                    material="roughness: 0.4; metalness: 0.3; color: #2a1810"
                ></a-box>

                {/* Brass kick plate */}
                <a-box position="0 0.15 0.065" width="0.7" height="0.25" depth="0.02"
                       material={materials.brass}></a-box>
            </a-entity>

            {/* Center divider between doors */}
            <a-box position="0 1.1 0.02" width="0.06" height="2.2" depth="0.08" material={materials.darkWood}></a-box>
        </a-entity>
    )
}
