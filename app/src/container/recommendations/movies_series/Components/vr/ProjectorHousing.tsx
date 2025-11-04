import type {DefaultVrComponentProps} from "@/container/types_common"
import Projector from "./Projector.tsx"

const ProjectorHousing = ({position = "0 3 -8", rotation = "0 0 0"}: DefaultVrComponentProps) => {
    return (
        <a-entity position={position} rotation={rotation}>
            {/* Ceiling mount plate - larger and more substantial */}
            <a-box position="0 5 0" width="1.2" height="0.25" depth="1" color="#3a3a3a" metalness="0.8"
                   roughness="0.4"/>

            {/* Ceiling mount bolts */}
            <a-cylinder
                position="-0.5 5.05 -0.4"
                radius="0.025"
                height="0.05"
                color="#1a1a1a"
                metalness="1"
                roughness="0.2"
            />
            <a-cylinder position="0.5 5.05 -0.4" radius="0.025" height="0.05" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>
            <a-cylinder position="-0.5 5.05 0.4" radius="0.025" height="0.05" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>
            <a-cylinder position="0.5 5.05 0.4" radius="0.025" height="0.05" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>

            {/* Main support beams - thicker for better proportions */}
            <a-box
                position="-0.35 2 0"
                width="0.12"
                height="5"
                depth="0.12"
                color="#2a2a2a"
                metalness="0.9"
                roughness="0.3"
            />
            <a-box
                position="0.35 2 0"
                width="0.12"
                height="5"
                depth="0.12"
                color="#2a2a2a"
                metalness="0.9"
                roughness="0.3"
            />

            {/* Cross-bracing - upper */}
            <a-box
                position="0 4.5 0"
                width="0.8"
                height="0.06"
                depth="0.06"
                color="#3a3a3a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0 4.5 0"
                width="0.06"
                height="0.06"
                depth="0.3"
                color="#3a3a3a"
                metalness="0.8"
                roughness="0.3"
            />

            {/* Cross-bracing - middle */}
            <a-box
                position="0 2.5 0"
                width="0.8"
                height="0.06"
                depth="0.06"
                color="#3a3a3a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0 2.5 0"
                width="0.06"
                height="0.06"
                depth="0.3"
                color="#3a3a3a"
                metalness="0.8"
                roughness="0.3"
            />

            {/* Protective cage frame around projector */}
            <a-box
                position="0 0.1 0.35"
                width="0.8"
                height="0.06"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0 0.1 -0.35"
                width="0.8"
                height="0.06"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="-0.37 0.1 0"
                width="0.06"
                height="0.06"
                depth="0.7"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0.37 0.1 0"
                width="0.06"
                height="0.06"
                depth="0.7"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />

            {/* Vertical cage corners */}
            <a-box
                position="-0.37 -0.3 0.35"
                width="0.06"
                height="0.8"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0.37 -0.3 0.35"
                width="0.06"
                height="0.8"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="-0.37 -0.3 -0.35"
                width="0.06"
                height="0.8"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0.37 -0.3 -0.35"
                width="0.06"
                height="0.8"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />

            {/* Bottom cage frame */}
            <a-box
                position="0 -0.7 0.35"
                width="0.8"
                height="0.06"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0 -0.7 -0.35"
                width="0.8"
                height="0.06"
                depth="0.06"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="-0.37 -0.7 0"
                width="0.06"
                height="0.06"
                depth="0.7"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />
            <a-box
                position="0.37 -0.7 0"
                width="0.06"
                height="0.06"
                depth="0.7"
                color="#2a2a2a"
                metalness="0.8"
                roughness="0.3"
            />

            {/* Adjustable tilt mechanism */}
            <a-cylinder
                position="-0.3 0.05 0"
                radius="0.05"
                height="0.2"
                rotation="0 0 90"
                color="#4a4a4a"
                metalness="0.9"
                roughness="0.2"
            />
            <a-cylinder
                position="0.3 0.05 0"
                radius="0.05"
                height="0.2"
                rotation="0 0 90"
                color="#4a4a4a"
                metalness="0.9"
                roughness="0.2"
            />

            {/* Cable management tray */}
            <a-box
                position="0.15 0.08 0.4"
                width="0.08"
                height="0.05"
                depth="0.4"
                color="#1a1a1a"
                metalness="0.6"
                roughness="0.5"
            />

            {/* Power cable running up the support beam */}
            <a-cylinder position="0.15 3 0.42" radius="0.02" height="6" color="#0a0a0a"/>

            {/* The actual projector component */}
            <Projector position="0 -0.3 0" rotation="-10 0 0"/>
        </a-entity>
    )
}

export default ProjectorHousing
