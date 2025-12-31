// Shared terrain height function - single source of truth
export function getTerrainHeight(x: number, z: number): number {
    let height = 0;
    
    // Rolling hills - smoother, lower frequency waves
    height += Math.sin(x * 0.08) * Math.cos(z * 0.08) * 1.0;
    height += Math.sin(x * 0.04) * Math.cos(z * 0.04) * 1.8;
    height += Math.sin(x * 0.02) * Math.cos(z * 0.02) * 0.8; // Very smooth large waves
    
    if (Math.abs(x) > 20) {
        height += Math.sin(x * 0.12) * 1.2; // Smoother side hills
    }
    
    // Water hazard depression - smoother falloff
    const waterX = 8;
    const waterZ = 2;
    const waterRadius = 7;
    const distToWater = Math.sqrt((x - waterX) ** 2 + (z - waterZ) ** 2);
    if (distToWater < waterRadius) {
        // Smooth falloff using smoothstep-like function
        const t = distToWater / waterRadius;
        const smoothT = t * t * (3 - 2 * t); // Smoothstep
        const depth = (1 - smoothT) * 1.8;
        height -= depth;
    }
    
    // Fairway area (flattened more)
    const fairwayWidth = 8;
    const startX = 0;
    const endX = 5;
    const startZ = 40;
    const endZ = -35;
    
    if (z <= startZ && z >= endZ) {
        const t = (startZ - z) / (startZ - endZ);
        const curveX = startX + (endX - startX) * t;
        const distFromCenter = Math.abs(x - curveX);
        if (distFromCenter < fairwayWidth) {
            // Smooth transition to fairway
            const edgeDist = Math.max(0, fairwayWidth - distFromCenter);
            const blendFactor = Math.min(1, edgeDist / 2); // Smooth blend over 2 units
            const smoothBlend = blendFactor * blendFactor * (3 - 2 * blendFactor); // Smoothstep
            height = height * (1 - smoothBlend * 0.8) + 0.05 * smoothBlend;
        }
    }
    
    // Tee box (elevated)
    if (Math.abs(x) < 2 && z > 38 && z < 42) {
        height = 0.3;
    }
    
    // Green (elevated and very flat) - smooth transition
    const greenRadius = 6.5;
    const distToGreen = Math.sqrt((x - 5) ** 2 + (z + 35) ** 2);
    if (distToGreen < greenRadius) {
        // Smooth transition to flat green
        const t = distToGreen / greenRadius;
        const smoothT = t * t * (3 - 2 * t); // Smoothstep
        height = height * smoothT + 0.08 * (1 - smoothT);
    }
    
    // Hole - actual depression in the green (bigger hole)
    const holeX = 5;
    const holeZ = -35;
    const holeRadius = 0.4; // Bigger hole
    const distToHole = Math.sqrt((x - holeX) ** 2 + (z - holeZ) ** 2);
    if (distToHole < holeRadius) {
        // Create a smooth depression for the hole
        const t = distToHole / holeRadius;
        const smoothT = t * t * (3 - 2 * t); // Smoothstep
        const holeDepth = 0.2; // Depth of the hole
        height -= holeDepth * (1 - smoothT);
    }
    
    return height;
}
