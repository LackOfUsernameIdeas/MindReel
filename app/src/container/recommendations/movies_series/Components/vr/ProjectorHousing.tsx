import type {DefaultVrComponentProps} from "@/container/types_common"
import Projector from "./Projector.tsx";

const ProjectorHousing = ({position = "0 3 -8", rotation = "0 0 0"}: DefaultVrComponentProps) => {
    return (
        <a-entity position={position} rotation={rotation}>
            {/* Ceiling mount plate */}
            <a-box position="0 0.5 0" width="1" height="0.2" depth="0.8" color="#3a3a3a" metalness="0.8"
                   roughness="0.4"/>

            {/* Ceiling mount bolts */}
            <a-cylinder position="-0.4 0.52 -0.3" radius="0.02" height="0.04" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>
            <a-cylinder position="0.4 0.52 -0.3" radius="0.02" height="0.04" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>
            <a-cylinder position="-0.4 0.52 0.3" radius="0.02" height="0.04" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>
            <a-cylinder position="0.4 0.52 0.3" radius="0.02" height="0.04" color="#1a1a1a" metalness="1"
                        roughness="0.2"/>

            {/* Support arms from ceiling */}
            <a-box
                position="-0.3 0.3 0"
                width="0.08"
                height="0.4"
                depth="0.08"
                color="#2a2a2a"
                metalness="0.9"
                roughness="0.3"
            />
            <a-box
                position="0.3 0.3 0"
                width="0.08"
                height="0.4"
                depth="0.08"
                color="#2a2a2a"
                metalness="0.9"
                roughness="0.3"
            />

            {/* Horizontal support beam */}
            <a-box position="0 0.1 0" width="0.7" height="0.06" depth="0.5" color="#2a2a2a" metalness="0.8"
                   roughness="0.3"/>

            {/* Adjustable tilt mechanism */}
            <a-cylinder
                position="-0.25 0.05 0"
                radius="0.04"
                height="0.15"
                rotation="0 0 90"
                color="#4a4a4a"
                metalness="0.9"
                roughness="0.2"
            />
            <a-cylinder
                position="0.25 0.05 0"
                radius="0.04"
                height="0.15"
                rotation="0 0 90"
                color="#4a4a4a"
                metalness="0.9"
                roughness="0.2"
            />

            {/* Cable management tray */}
            <a-box
                position="0 0.08 0.3"
                width="0.15"
                height="0.05"
                depth="0.3"
                color="#1a1a1a"
                metalness="0.6"
                roughness="0.5"
            />

            {/* Power cable running to ceiling */}
            <a-cylinder position="0.15 0.25 0.35" radius="0.015" height="0.5" color="#0a0a0a"/>

            {/* The actual projector component */}
            <Projector position="0 0 0" rotation="-10 0 0"/>
        </a-entity>
    )
}

export default ProjectorHousing
