// Mutable state shared between React and the WebGL loop without re-rendering.
export const sceneStore = {
  /** Index into SHAPE_BUILDERS the cloud is morphing towards. */
  shape: 0,
  /** 1 while the hero is on screen: brighter cloud, shifted aside on wide screens. */
  hero: 1,
};
