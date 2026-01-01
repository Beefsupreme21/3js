import { useBattle } from './Battle/BattleContext';
import { getCharacterComponent } from './Registry/CharacterRegistry';
import { getEnemyComponent } from './Registry/EnemyRegistry';
import { Text } from '@react-three/drei';
import Projectile from './Battle/Projectile';
import DamageNumber from './Battle/DamageNumber';

export default function FightScene() {
    const { heroes, enemies, battleStatus, projectiles, damageNumbers } = useBattle();

    // Use battle entities, or show placeholders if not initialized yet
    const displayHeroes = heroes.length > 0 
        ? heroes
        : [];

    const displayEnemies = enemies.length > 0
        ? enemies
        : [];

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />

            {/* Display heroes on the left */}
            {displayHeroes.map((hero, index) => {
                const CharacterComponent = getCharacterComponent(hero.characterType as any);
                return (
                    <group key={hero.id} position={hero.position}>
                        <CharacterComponent position={[0, 0, 0]} />
                            <Text
                                position={[0, -1.5, 0]}
                                fontSize={0.3}
                                color={hero.isAlive ? "white" : "red"}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {hero.characterType.charAt(0).toUpperCase() + hero.characterType.slice(1)}
                            </Text>
                            {/* Health bar */}
                            {battleStatus !== 'setup' && (
                                <group position={[0, -2, 0]}>
                                    <mesh position={[0, 0, 0]}>
                                        <boxGeometry args={[1, 0.1, 0.1]} />
                                        <meshBasicMaterial color="#333333" />
                                    </mesh>
                                    <mesh position={[-(1 - hero.health / hero.maxHealth) / 2, 0, 0.05]}>
                                        <boxGeometry args={[hero.health / hero.maxHealth, 0.1, 0.1]} />
                                        <meshBasicMaterial color={hero.health > 50 ? "#00ff00" : hero.health > 25 ? "#ffff00" : "#ff0000"} />
                                    </mesh>
                                </group>
                            )}
                        </group>
                    );
                })}

            {/* Display enemies on the right */}
            {displayEnemies.map((enemy, index) => {
                const EnemyComponent = getEnemyComponent(enemy.characterType as any);
                return (
                    <group key={enemy.id} position={enemy.position}>
                            <EnemyComponent position={[0, 0, 0]} />
                            <Text
                                position={[0, -1.5, 0]}
                                fontSize={0.3}
                                color={enemy.isAlive ? "red" : "gray"}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {enemy.characterType.charAt(0).toUpperCase() + enemy.characterType.slice(1)}
                            </Text>
                            {/* Health bar */}
                            {battleStatus !== 'setup' && (
                                <group position={[0, -2, 0]}>
                                    <mesh position={[0, 0, 0]}>
                                        <boxGeometry args={[1, 0.1, 0.1]} />
                                        <meshBasicMaterial color="#333333" />
                                    </mesh>
                                    <mesh position={[-(1 - enemy.health / enemy.maxHealth) / 2, 0, 0.05]}>
                                        <boxGeometry args={[enemy.health / enemy.maxHealth, 0.1, 0.1]} />
                                        <meshBasicMaterial color={enemy.health > 50 ? "#00ff00" : enemy.health > 25 ? "#ffff00" : "#ff0000"} />
                                    </mesh>
                                </group>
                            )}
                        </group>
                    );
                })}

            {/* Display projectiles */}
            {projectiles.map((projectile) => (
                <Projectile
                    key={projectile.id}
                    from={projectile.from}
                    to={projectile.to}
                    type={projectile.type}
                    onComplete={() => {}}
                />
            ))}

            {/* Display damage numbers */}
            {damageNumbers.map((damageNumber) => (
                <DamageNumber
                    key={damageNumber.id}
                    position={damageNumber.position}
                    damage={damageNumber.damage}
                    onComplete={() => {}}
                />
            ))}
        </>
    );
}
