/**
 * Този файл добавя декларации за A-Frame елементи към глобалния JSX namespace,
 * за да не се получават грешки от TypeScript при използване на тагове като
 * <a-scene>, <a-entity>, <a-image> и др. в React компонентите.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        webxr?: string;
        "vr-mode-ui"?: string;
        renderer?: string;
        embedded?: boolean;
        style?: React.CSSProperties;
        fog?: string;
      };
      "a-assets": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        timeout?: string | number;
        responseType?: string;
        onLoaded?: (event: any) => void;
      };
      "a-entity": React.ClassAttributes<HTMLElement> &
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          rotation?: string;
          class?: string;
          cursor?: string;
          "laser-controls"?: string;
          raycaster?: string;
          "super-hands"?: boolean;
          onClick?: React.MouseEventHandler<HTMLElement>;
          draggable?: boolean;
          geometry?: string;
          websurface?: string;
        };
      "a-camera": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        rotation?: string;
      };
      "a-image": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        width?: string | number;
        height?: string | number;
        position?: string;
        rotation?: string;
        material?: string;
        color?: string;
        class?: string;
        transparent?: boolean;
        crossorigin?: string;
        onClick?: (event: any) => void;
      };
      "a-video": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        width?: string | number;
        height?: string | number;
        position?: string;
        rotation?: string;
        autoplay?: boolean | string;
        loop?: boolean | string;
        muted?: boolean | string;
        preload?: string;
        crossOrigin?: string;
        metalness?: string;
        geometry?: string;
      };
      "a-plane": React.ClassAttributes<HTMLElement> &
        React.HTMLAttributes<HTMLElement> & {
          opacity?: string | number;
          width?: string | number;
          height?: string | number;
          transparent?: string | boolean;
          metalness?: string | number;
          roughness?: string | number;
          class?: string;
          color?: string;
          material?: string;
          position?: string;
          rotation?: string;
          "static-body"?: boolean;
          onClick?: (event: any) => void;
        };
      "a-circle": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        rotation?: string;
        radius?: string | number;
        color?: string;
        material?: string;
        emissive?: string;
        "emissive-intensity"?: string | number;
        geometry?: string;
        opacity?: string;
        transparent?: string | boolean;
        metalness?: string | number;
        roughness?: string | number;
        animation__mouseenter?: string;
        animation__mouseleave?: string;
        animation__click?: string;
      };
      "a-box": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        rotation?: string;
        width?: string;
        height?: string;
        depth?: string;
        color?: string;
        material?: string;
        emissive?: string;
        "emissive-intensity"?: string | number;
        opacity?: string;
        transparent?: string | boolean;
        metalness?: string | number;
        roughness?: string | number;
        shadow?: string;
      };
      "a-sphere": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        radius?: string | number;
        color?: string;
        position?: string;
        rotation?: string;
        material?: string;
        geometry?: string;
        emissive?: string;
        "emissive-intensity"?: string | number;
        opacity?: string;
        transparent?: string | boolean;
        metalness?: string | number;
        roughness?: string | number;
      };
      "a-cylinder": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        rotation?: string;
        radius?: string;
        height?: string;
        color?: string;
        material?: string;
        emissive?: string;
        "emissive-intensity"?: string | number;
        opacity?: string;
        transparent?: string | boolean;
        metalness?: string | number;
        roughness?: string | number;
      };
      "a-cone": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        rotation?: string;
        color?: string;
        material?: string;
        radius?: string | number;
        "radius-bottom"?: string | number;
        "radius-top"?: string | number;
        height?: string | number;
        metalness?: string | number;
        roughness?: string | number;
      };
      "a-torus": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        rotation?: string;
        radius?: string | number;
        "radius-tubular"?: string | number;
        color?: string;
        material?: string;
        metalness?: string | number;
        roughness?: string | number;
        geometry?: string;
      };
      "a-light": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        type?: string;
        position?: string;
        rotation?: string;
        color?: string;
        target?: string;
        intensity?: string | number;
        distance?: string | number;
        angle?: string | number;
        penumbra?: string | number;
        decay?: string | number;
        castShadow?: string | boolean;
      };
      "a-text": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        align?: string;
        color?: string;
        width?: number | string;
        "wrap-count"?: string | number;
        font?: string;
        position?: string;
        rotation?: string;
        class?: string;
        material?: string;
        shader?: string;
        onClick?: (event: any) => void;
        negate?: string | boolean;
      };
      "a-troika-text": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        align?: string;
        color?: string;
        width?: number | string;
        "wrap-count"?: string | number;
        font?: string;
        position?: string;
        rotation?: string;
        class?: string;
        material?: string;
        shader?: string;
        onClick?: (event: any) => void;
        negate?: string | boolean;
      };
      "a-asset-item": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        id?: string;
        src?: string;
      };
      "a-sky"?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
