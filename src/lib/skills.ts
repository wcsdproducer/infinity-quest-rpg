
export type SkillName = 
    // Trained Skills
    | 'Linguistics' | 'Zoology' | 'Botany' | 'Geology' | 'Industrial Equipment' | 'Jury-Rigging' | 'Chemistry' | 'Computers' | 'Zero-G' | 'Mathematics' | 'Art' | 'Archaeology' | 'Theology' | 'Military Training' | 'Rimwise' | 'Athletics'
    // Expert Skills
    | 'Psychology' | 'Pathology' | 'Field Medicine' | 'Ecology' | 'Asteroid Mining' | 'Mechanical Repair' | 'Explosives' | 'Pharmacology' | 'Hacking' | 'Piloting' | 'Physics' | 'Mysticism' | 'Wilderness Survival' | 'Firearms' | 'Hand-to-Hand Combat'
    // Master Skills
    | 'Sophontology' | 'Exobiology' | 'Surgery' | 'Planetology' | 'Robotics' | 'Engineering' | 'Cybernetics' | 'Artificial Intelligence' | 'Hyperspace' | 'Xenoesotericism' | 'Command';


export type SkillLevel = 'Trained' | 'Expert' | 'Master';

export interface SkillDefinition {
    name: SkillName;
    level: SkillLevel;
    description: string;
    prerequisites: SkillName[];
}

export const skillCatalog: Record<SkillName, SkillDefinition> = {
    // === TRAINED SKILLS ===
    'Linguistics': { name: 'Linguistics', level: 'Trained', description: 'The study of language.', prerequisites: [] },
    'Zoology': { name: 'Zoology', level: 'Trained', description: 'The study of animal life.', prerequisites: [] },
    'Botany': { name: 'Botany', level: 'Trained', description: 'The study of plant life.', prerequisites: [] },
    'Geology': { name: 'Geology', level: 'Trained', description: 'The study of the solid features of any celestial body.', prerequisites: [] },
    'Industrial Equipment': { name: 'Industrial Equipment', level: 'Trained', description: 'Operating common industrial equipment like power tools, cutting torches, etc.', prerequisites: [] },
    'Jury-Rigging': { name: 'Jury-Rigging', level: 'Trained', description: 'Creating temporary solutions with available materials.', prerequisites: [] },
    'Chemistry': { name: 'Chemistry', level: 'Trained', description: 'The study of matter and its properties.', prerequisites: [] },
    'Computers': { name: 'Computers', level: 'Trained', description: 'Operating and interacting with computer systems.', prerequisites: [] },
    'Zero-G': { name: 'Zero-G', level: 'Trained', description: 'Navigating and working in zero-gravity environments.', prerequisites: [] },
    'Mathematics': { name: 'Mathematics', level: 'Trained', description: 'The study of numbers, quantity, structure, and space.', prerequisites: [] },
    'Art': { name: 'Art', level: 'Trained', description: 'Knowledge and creation of various art forms.', prerequisites: [] },
    'Archaeology': { name: 'Archaeology', level: 'Trained', description: 'The study of history through the excavation of sites and the analysis of artifacts.', prerequisites: [] },
    'Theology': { name: 'Theology', level: 'Trained', description: 'The study of religious faith, practice, and experience.', prerequisites: [] },
    'Military Training': { name: 'Military Training', level: 'Trained', description: 'Knowledge of military protocol, hierarchy, and procedures.', prerequisites: [] },
    'Rimwise': { name: 'Rimwise', level: 'Trained', description: 'Street-smarts and knowledge of the criminal underworld.', prerequisites: [] },
    'Athletics': { name: 'Athletics', level: 'Trained', description: 'Used for climbing, jumping, running, swimming, and other feats of physical prowess.', prerequisites: [] },

    // === EXPERT SKILLS ===
    'Psychology': { name: 'Psychology', level: 'Expert', description: 'The study of the human mind and its functions.', prerequisites: ['Linguistics', 'Zoology', 'Botany'] },
    'Pathology': { name: 'Pathology', level: 'Expert', description: 'The study of the causes and effects of diseases.', prerequisites: ['Zoology', 'Botany'] },
    'Field Medicine': { name: 'Field Medicine', level: 'Expert', description: 'Providing immediate medical care in the field.', prerequisites: ['Zoology', 'Botany'] },
    'Ecology': { name: 'Ecology', level: 'Expert', description: 'The study of relations of organisms to one another and to their physical surroundings.', prerequisites: ['Zoology', 'Botany', 'Geology'] },
    'Asteroid Mining': { name: 'Asteroid Mining', level: 'Expert', description: 'Techniques for extracting minerals from asteroids.', prerequisites: ['Geology', 'Industrial Equipment'] },
    'Mechanical Repair': { name: 'Mechanical Repair', level: 'Expert', description: 'Fixing and maintaining mechanical devices.', prerequisites: ['Industrial Equipment', 'Jury-Rigging'] },
    'Explosives': { name: 'Explosives', level: 'Expert', description: 'Handling, creating, and disarming explosive devices.', prerequisites: ['Jury-Rigging', 'Chemistry', 'Military Training'] },
    'Pharmacology': { name: 'Pharmacology', level: 'Expert', description: 'The study of drugs and their effects.', prerequisites: ['Chemistry', 'Jury-Rigging'] },
    'Hacking': { name: 'Hacking', level: 'Expert', description: 'Gaining unauthorized access to computer systems.', prerequisites: ['Computers'] },
    'Piloting': { name: 'Piloting', level: 'Expert', description: 'Operating spaceships and other atmospheric/space-based vehicles.', prerequisites: ['Zero-G'] },
    'Physics': { name: 'Physics', level: 'Expert', description: 'The study of matter, energy, and their interactions.', prerequisites: ['Mathematics'] },
    'Mysticism': { name: 'Mysticism', level: 'Expert', description: 'Understanding of supernatural or esoteric beliefs and practices.', prerequisites: ['Art', 'Archaeology', 'Theology'] },
    'Wilderness Survival': { name: 'Wilderness Survival', level: 'Expert', description: 'Skills for surviving in natural, hostile environments.', prerequisites: ['Botany', 'Military Training'] },
    'Firearms': { name: 'Firearms', level: 'Expert', description: 'Operating personal firearms.', prerequisites: ['Military Training', 'Rimwise'] },
    'Hand-to-Hand Combat': { name: 'Hand-to-Hand Combat', level: 'Expert', description: 'Unarmed and melee combat proficiency.', prerequisites: ['Rimwise', 'Athletics'] },

    // === MASTER SKILLS ===
    'Sophontology': { name: 'Sophontology', level: 'Master', description: 'The study of intelligent life, both human and alien.', prerequisites: ['Psychology'] },
    'Exobiology': { name: 'Exobiology', level: 'Master', description: 'The study of extraterrestrial life.', prerequisites: ['Pathology'] },
    'Surgery': { name: 'Surgery', level: 'Master', description: 'Performing complex medical operations.', prerequisites: ['Pathology', 'Field Medicine'] },
    'Planetology': { name: 'Planetology', level: 'Master', description: 'The study of planets and other celestial bodies.', prerequisites: ['Ecology', 'Asteroid Mining'] },
    'Robotics': { name: 'Robotics', level: 'Master', description: 'The design, construction, and operation of robots.', prerequisites: ['Mechanical Repair'] },
    'Engineering': { name: 'Engineering', level: 'Master', description: 'The application of scientific principles to design and build machines and structures.', prerequisites: ['Mechanical Repair'] },
    'Cybernetics': { name: 'Cybernetics', level: 'Master', description: 'Knowledge of cybernetic implants and prosthetics.', prerequisites: ['Mechanical Repair'] },
    'Artificial Intelligence': { name: 'Artificial Intelligence', level: 'Master', description: 'The theory and development of computer systems able to perform tasks normally requiring human intelligence.', prerequisites: ['Hacking'] },
    'Hyperspace': { name: 'Hyperspace', level: 'Master', description: 'Understanding the principles of faster-than-light travel.', prerequisites: ['Piloting', 'Physics', 'Mysticism'] },
    'Xenoesotericism': { name: 'Xenoesotericism', level: 'Master', description: 'The study of arcane alien technologies and philosophies.', prerequisites: ['Mysticism'] },
    'Command': { name: 'Command', level: 'Master', description: 'Leading and directing personnel effectively, especially in high-stress situations.', prerequisites: ['Piloting', 'Firearms'] },
};
