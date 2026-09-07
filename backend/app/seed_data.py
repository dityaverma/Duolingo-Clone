"""Course seed data — Spanish 101 + Duolingo Math. Loaded into SQLite on first boot."""

COURSE = {
    'units': [
        {
            'id': 'u1', 'title': 'Section 1, Unit 1', 'subtitle': 'Use basic phrases, greet people',
            'color': '#58cc02', 'color_dark': '#58a700', 'order_index': 0,
            'skills': [
                {'id': 's1', 'title': 'Greet', 'icon': 'star', 'description': 'Learn to say hello and goodbye', 'order_index': 0, 'lessons': [
                    {'id': 'l1', 'title': 'Greetings 1', 'order_index': 0, 'exercises': [
                        {'id': 'e1', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the apple"?', 'options': [{'text': 'la manzana', 'img': '🍎'}, {'text': 'el pan', 'img': '🥖'}, {'text': 'el agua', 'img': '💧'}], 'correctAnswer': 'la manzana'}},
                        {'id': 'e2', 'type': 'translate_wordbank', 'payload': {'prompt': 'I am a boy', 'correctAnswer': 'yo soy un niño', 'wordBank': ['yo', 'soy', 'un', 'niño', 'ella', 'manzana', 'es']}},
                        {'id': 'e3', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "hello"?', 'options': [{'text': 'hola', 'img': '👋'}, {'text': 'adiós', 'img': '👋🏻'}, {'text': 'gracias', 'img': '🙏'}], 'correctAnswer': 'hola'}},
                        {'id': 'e4', 'type': 'fill_blank', 'payload': {'sentence': 'Yo ___ un niño.', 'options': ['soy', 'eres', 'es'], 'correctAnswer': 'soy', 'translation': 'I am a boy.'}},
                        {'id': 'e5', 'type': 'type_answer', 'payload': {'prompt': 'Write "hello" in Spanish', 'correctAnswer': 'hola', 'hint': 'Starts with H'}},
                    ]},
                    {'id': 'l2', 'title': 'Greetings 2', 'order_index': 1, 'exercises': [
                        {'id': 'e6', 'type': 'match_pairs', 'payload': {'pairs': [{'left': 'hola', 'right': 'hello'}, {'left': 'adiós', 'right': 'goodbye'}, {'left': 'gracias', 'right': 'thanks'}, {'left': 'sí', 'right': 'yes'}, {'left': 'no', 'right': 'no'}]}},
                        {'id': 'e7', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "goodbye"?', 'options': [{'text': 'adiós', 'img': '✋'}, {'text': 'buenos días', 'img': '☀️'}, {'text': 'buenas noches', 'img': '🌙'}], 'correctAnswer': 'adiós'}},
                        {'id': 'e8', 'type': 'translate_wordbank', 'payload': {'prompt': 'Good morning', 'correctAnswer': 'buenos días', 'wordBank': ['buenos', 'días', 'noches', 'tardes', 'hola', 'adiós']}},
                        {'id': 'e9', 'type': 'type_answer', 'payload': {'prompt': 'Write "thank you" in Spanish', 'correctAnswer': 'gracias', 'hint': 'Starts with G'}},
                    ]},
                ]},
                {'id': 's2', 'title': 'Travel', 'icon': 'plane', 'description': 'Words for travel', 'order_index': 1, 'lessons': [
                    {'id': 'l3', 'title': 'Travel 1', 'order_index': 0, 'exercises': [
                        {'id': 'e10', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the airport"?', 'options': [{'text': 'el aeropuerto', 'img': '✈️'}, {'text': 'la estación', 'img': '🚆'}, {'text': 'el hotel', 'img': '🏨'}], 'correctAnswer': 'el aeropuerto'}},
                        {'id': 'e11', 'type': 'translate_wordbank', 'payload': {'prompt': 'I need a hotel', 'correctAnswer': 'necesito un hotel', 'wordBank': ['necesito', 'un', 'hotel', 'ella', 'tú', 'aeropuerto']}},
                        {'id': 'e12', 'type': 'fill_blank', 'payload': {'sentence': '¿Dónde está ___ aeropuerto?', 'options': ['el', 'la', 'los'], 'correctAnswer': 'el', 'translation': 'Where is the airport?'}},
                        {'id': 'e13', 'type': 'type_answer', 'payload': {'prompt': 'Write "hotel" in Spanish', 'correctAnswer': 'hotel', 'hint': 'Same word'}},
                    ]},
                    {'id': 'l4', 'title': 'Travel 2', 'order_index': 1, 'exercises': [
                        {'id': 'e14', 'type': 'match_pairs', 'payload': {'pairs': [{'left': 'aeropuerto', 'right': 'airport'}, {'left': 'hotel', 'right': 'hotel'}, {'left': 'tren', 'right': 'train'}, {'left': 'coche', 'right': 'car'}]}},
                        {'id': 'e15', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the train"?', 'options': [{'text': 'el tren', 'img': '🚆'}, {'text': 'el coche', 'img': '🚗'}, {'text': 'el barco', 'img': '🚢'}], 'correctAnswer': 'el tren'}},
                        {'id': 'e16', 'type': 'translate_wordbank', 'payload': {'prompt': 'The car is red', 'correctAnswer': 'el coche es rojo', 'wordBank': ['el', 'coche', 'es', 'rojo', 'azul', 'ella']}},
                    ]},
                ]},
                {'id': 's3', 'title': 'Family', 'icon': 'family', 'description': 'Family members', 'order_index': 2, 'lessons': [
                    {'id': 'l5', 'title': 'Family 1', 'order_index': 0, 'exercises': [
                        {'id': 'e17', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the mother"?', 'options': [{'text': 'la madre', 'img': '👩'}, {'text': 'el padre', 'img': '👨'}, {'text': 'el hermano', 'img': '👦'}], 'correctAnswer': 'la madre'}},
                        {'id': 'e18', 'type': 'translate_wordbank', 'payload': {'prompt': 'The father is tall', 'correctAnswer': 'el padre es alto', 'wordBank': ['el', 'padre', 'es', 'alto', 'madre', 'pequeño']}},
                        {'id': 'e19', 'type': 'fill_blank', 'payload': {'sentence': 'Mi ___ es alta.', 'options': ['madre', 'padre', 'hermano'], 'correctAnswer': 'madre', 'translation': 'My mother is tall.'}},
                        {'id': 'e20', 'type': 'type_answer', 'payload': {'prompt': 'Write "father" in Spanish', 'correctAnswer': 'padre', 'hint': 'Starts with P'}},
                    ]},
                ]},
            ],
        },
        {
            'id': 'u2', 'title': 'Section 1, Unit 2', 'subtitle': 'Order food and drinks',
            'color': '#ce82ff', 'color_dark': '#a560e8', 'order_index': 1,
            'skills': [
                {'id': 's4', 'title': 'Food', 'icon': 'apple', 'description': 'Common food words', 'order_index': 0, 'lessons': [
                    {'id': 'l6', 'title': 'Food 1', 'order_index': 0, 'exercises': [
                        {'id': 'e21', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the bread"?', 'options': [{'text': 'el pan', 'img': '🥖'}, {'text': 'la manzana', 'img': '🍎'}, {'text': 'el agua', 'img': '💧'}], 'correctAnswer': 'el pan'}},
                        {'id': 'e22', 'type': 'translate_wordbank', 'payload': {'prompt': 'I eat bread', 'correctAnswer': 'yo como pan', 'wordBank': ['yo', 'como', 'pan', 'agua', 'bebo', 'ella']}},
                        {'id': 'e23', 'type': 'fill_blank', 'payload': {'sentence': 'Yo ___ agua.', 'options': ['bebo', 'como', 'soy'], 'correctAnswer': 'bebo', 'translation': 'I drink water.'}},
                        {'id': 'e24', 'type': 'match_pairs', 'payload': {'pairs': [{'left': 'pan', 'right': 'bread'}, {'left': 'agua', 'right': 'water'}, {'left': 'manzana', 'right': 'apple'}, {'left': 'leche', 'right': 'milk'}]}},
                    ]},
                    {'id': 'l7', 'title': 'Food 2', 'order_index': 1, 'exercises': [
                        {'id': 'e25', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the milk"?', 'options': [{'text': 'la leche', 'img': '🥛'}, {'text': 'el jugo', 'img': '🧃'}, {'text': 'el café', 'img': '☕'}], 'correctAnswer': 'la leche'}},
                        {'id': 'e26', 'type': 'type_answer', 'payload': {'prompt': 'Write "water" in Spanish', 'correctAnswer': 'agua', 'hint': 'Starts with A'}},
                        {'id': 'e27', 'type': 'translate_wordbank', 'payload': {'prompt': 'She drinks milk', 'correctAnswer': 'ella bebe leche', 'wordBank': ['ella', 'bebe', 'leche', 'yo', 'como', 'pan']}},
                    ]},
                ]},
                {'id': 's5', 'title': 'Animals', 'icon': 'paw', 'description': 'Common animals', 'order_index': 1, 'lessons': [
                    {'id': 'l8', 'title': 'Animals 1', 'order_index': 0, 'exercises': [
                        {'id': 'e28', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "the dog"?', 'options': [{'text': 'el perro', 'img': '🐶'}, {'text': 'el gato', 'img': '🐱'}, {'text': 'el pájaro', 'img': '🐦'}], 'correctAnswer': 'el perro'}},
                        {'id': 'e29', 'type': 'translate_wordbank', 'payload': {'prompt': 'The cat is black', 'correctAnswer': 'el gato es negro', 'wordBank': ['el', 'gato', 'es', 'negro', 'blanco', 'perro']}},
                        {'id': 'e30', 'type': 'match_pairs', 'payload': {'pairs': [{'left': 'perro', 'right': 'dog'}, {'left': 'gato', 'right': 'cat'}, {'left': 'pájaro', 'right': 'bird'}, {'left': 'pez', 'right': 'fish'}]}},
                    ]},
                ]},
            ],
        },
        {
            'id': 'u3', 'title': 'Section 1, Unit 3', 'subtitle': 'Describe your surroundings',
            'color': '#1cb0f6', 'color_dark': '#1899d6', 'order_index': 2,
            'skills': [
                {'id': 's6', 'title': 'Colors', 'icon': 'palette', 'description': 'Colors and adjectives', 'order_index': 0, 'lessons': [
                    {'id': 'l9', 'title': 'Colors 1', 'order_index': 0, 'exercises': [
                        {'id': 'e31', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one of these is "red"?', 'options': [{'text': 'rojo', 'img': '🔴'}, {'text': 'azul', 'img': '🔵'}, {'text': 'verde', 'img': '🟢'}], 'correctAnswer': 'rojo'}},
                        {'id': 'e32', 'type': 'translate_wordbank', 'payload': {'prompt': 'The sky is blue', 'correctAnswer': 'el cielo es azul', 'wordBank': ['el', 'cielo', 'es', 'azul', 'verde', 'rojo']}},
                        {'id': 'e33', 'type': 'type_answer', 'payload': {'prompt': 'Write "green" in Spanish', 'correctAnswer': 'verde', 'hint': 'Starts with V'}},
                    ]},
                ]},
                {'id': 's7', 'title': 'Numbers', 'icon': 'hash', 'description': 'Numbers 1-10', 'order_index': 1, 'lessons': [
                    {'id': 'l10', 'title': 'Numbers 1', 'order_index': 0, 'exercises': [
                        {'id': 'e34', 'type': 'match_pairs', 'payload': {'pairs': [{'left': 'uno', 'right': 'one'}, {'left': 'dos', 'right': 'two'}, {'left': 'tres', 'right': 'three'}, {'left': 'cuatro', 'right': 'four'}, {'left': 'cinco', 'right': 'five'}]}},
                        {'id': 'e35', 'type': 'multiple_choice', 'payload': {'prompt': 'Which one is "seven"?', 'options': [{'text': 'siete', 'img': '7️⃣'}, {'text': 'cinco', 'img': '5️⃣'}, {'text': 'diez', 'img': '🔟'}], 'correctAnswer': 'siete'}},
                        {'id': 'e36', 'type': 'type_answer', 'payload': {'prompt': 'Write "three" in Spanish', 'correctAnswer': 'tres', 'hint': 'Starts with T'}},
                    ]},
                ]},
            ],
        },
    ]
}

# Duolingo Math — separate course (unit ids prefixed with mu)
MATH_COURSE = {
    'units': [
        {
            'id': 'mu1', 'title': 'Math · Unit 1', 'subtitle': 'Add, subtract & spot patterns',
            'color': '#1cb0f6', 'color_dark': '#1899d6', 'order_index': 100,
            'skills': [
                {'id': 'ms1', 'title': 'Add', 'icon': 'plus', 'description': 'Simple addition', 'order_index': 0, 'lessons': [
                    {'id': 'ml1', 'title': 'Addition 1', 'order_index': 0, 'exercises': [
                        {'id': 'me1', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['2', '+', '2'], 'right': '4'},
                                {'left': ['3', '+', '2'], 'right': '5'},
                                {'left': ['4', '+', '2'], 'right': '?'},
                            ],
                            'options': ['5', '6'],
                            'correctAnswer': '6',
                        }},
                        {'id': 'me2', 'type': 'multiple_choice', 'payload': {
                            'prompt': 'What is 5 + 3?',
                            'options': [{'text': '8', 'img': '8️⃣'}, {'text': '7', 'img': '7️⃣'}, {'text': '9', 'img': '9️⃣'}],
                            'correctAnswer': '8',
                        }},
                        {'id': 'me3', 'type': 'fill_blank', 'payload': {
                            'sentence': '4 + ___ = 10',
                            'options': ['5', '6', '7'],
                            'correctAnswer': '6',
                            'translation': 'Find the missing addend',
                        }},
                        {'id': 'me4', 'type': 'type_answer', 'payload': {
                            'prompt': 'Type the answer: 7 + 4 =',
                            'correctAnswer': '11',
                            'hint': 'Two digits',
                        }},
                        {'id': 'me5', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['1', '+', '1'], 'right': '2'},
                                {'left': ['2', '+', '1'], 'right': '3'},
                                {'left': ['3', '+', '1'], 'right': '?'},
                            ],
                            'options': ['3', '4'],
                            'correctAnswer': '4',
                        }},
                    ]},
                    {'id': 'ml2', 'title': 'Addition 2', 'order_index': 1, 'exercises': [
                        {'id': 'me6', 'type': 'match_pairs', 'payload': {
                            'pairs': [
                                {'left': '2 + 3', 'right': '5'},
                                {'left': '4 + 4', 'right': '8'},
                                {'left': '6 + 1', 'right': '7'},
                                {'left': '9 + 0', 'right': '9'},
                            ],
                        }},
                        {'id': 'me7', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['10', '+', '5'], 'right': '15'},
                                {'left': ['20', '+', '5'], 'right': '25'},
                                {'left': ['30', '+', '5'], 'right': '?'},
                            ],
                            'options': ['35', '40'],
                            'correctAnswer': '35',
                        }},
                        {'id': 'me8', 'type': 'multiple_choice', 'payload': {
                            'prompt': 'What is 12 + 8?',
                            'options': [{'text': '20', 'img': '🎯'}, {'text': '18', 'img': '🎲'}, {'text': '22', 'img': '🎪'}],
                            'correctAnswer': '20',
                        }},
                        {'id': 'me9', 'type': 'type_answer', 'payload': {
                            'prompt': 'Type the answer: 15 + 6 =',
                            'correctAnswer': '21',
                            'hint': 'Teen + ones',
                        }},
                    ]},
                ]},
                {'id': 'ms2', 'title': 'Subtract', 'icon': 'minus', 'description': 'Simple subtraction', 'order_index': 1, 'lessons': [
                    {'id': 'ml3', 'title': 'Subtraction 1', 'order_index': 0, 'exercises': [
                        {'id': 'me10', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['9', '−', '1'], 'right': '8'},
                                {'left': ['8', '−', '1'], 'right': '7'},
                                {'left': ['7', '−', '1'], 'right': '?'},
                            ],
                            'options': ['5', '6'],
                            'correctAnswer': '6',
                        }},
                        {'id': 'me11', 'type': 'multiple_choice', 'payload': {
                            'prompt': 'What is 10 − 4?',
                            'options': [{'text': '6', 'img': '6️⃣'}, {'text': '5', 'img': '5️⃣'}, {'text': '7', 'img': '7️⃣'}],
                            'correctAnswer': '6',
                        }},
                        {'id': 'me12', 'type': 'fill_blank', 'payload': {
                            'sentence': '12 − ___ = 5',
                            'options': ['6', '7', '8'],
                            'correctAnswer': '7',
                            'translation': 'Find the missing number',
                        }},
                        {'id': 'me13', 'type': 'type_answer', 'payload': {
                            'prompt': 'Type the answer: 20 − 9 =',
                            'correctAnswer': '11',
                            'hint': 'Two digits',
                        }},
                    ]},
                ]},
                {'id': 'ms3', 'title': 'Patterns', 'icon': 'clock', 'description': 'Number patterns & sequences', 'order_index': 2, 'lessons': [
                    {'id': 'ml4', 'title': 'Patterns 1', 'order_index': 0, 'exercises': [
                        {'id': 'me14', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['2', '×', '2'], 'right': '4'},
                                {'left': ['3', '×', '2'], 'right': '6'},
                                {'left': ['4', '×', '2'], 'right': '?'},
                            ],
                            'options': ['6', '8'],
                            'correctAnswer': '8',
                        }},
                        {'id': 'me15', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['5', '+', '5'], 'right': '10'},
                                {'left': ['10', '+', '5'], 'right': '15'},
                                {'left': ['15', '+', '5'], 'right': '?'},
                            ],
                            'options': ['20', '25'],
                            'correctAnswer': '20',
                        }},
                        {'id': 'me16', 'type': 'match_pairs', 'payload': {
                            'pairs': [
                                {'left': '2, 4, 6, …', 'right': '8'},
                                {'left': '5, 10, 15, …', 'right': '20'},
                                {'left': '10, 9, 8, …', 'right': '7'},
                                {'left': '1, 3, 5, …', 'right': '7'},
                            ],
                        }},
                        {'id': 'me17', 'type': 'multiple_choice', 'payload': {
                            'prompt': 'What comes next? 3, 6, 9, ___',
                            'options': [{'text': '12', 'img': '🔢'}, {'text': '10', 'img': '🔟'}, {'text': '15', 'img': '✨'}],
                            'correctAnswer': '12',
                        }},
                    ]},
                ]},
            ],
        },
        {
            'id': 'mu2', 'title': 'Math · Unit 2', 'subtitle': 'Multiply & divide',
            'color': '#ce82ff', 'color_dark': '#a560e8', 'order_index': 101,
            'skills': [
                {'id': 'ms4', 'title': 'Multiply', 'icon': 'trophy', 'description': 'Times tables warm-up', 'order_index': 0, 'lessons': [
                    {'id': 'ml5', 'title': 'Multiply 1', 'order_index': 0, 'exercises': [
                        {'id': 'me18', 'type': 'follow_pattern', 'payload': {
                            'prompt': 'Follow the pattern',
                            'rows': [
                                {'left': ['2', '×', '3'], 'right': '6'},
                                {'left': ['3', '×', '3'], 'right': '9'},
                                {'left': ['4', '×', '3'], 'right': '?'},
                            ],
                            'options': ['11', '12'],
                            'correctAnswer': '12',
                        }},
                        {'id': 'me19', 'type': 'multiple_choice', 'payload': {
                            'prompt': 'What is 5 × 4?',
                            'options': [{'text': '20', 'img': '🎯'}, {'text': '16', 'img': '🎲'}, {'text': '25', 'img': '⭐'}],
                            'correctAnswer': '20',
                        }},
                        {'id': 'me20', 'type': 'type_answer', 'payload': {
                            'prompt': 'Type the answer: 6 × 6 =',
                            'correctAnswer': '36',
                            'hint': 'Perfect square',
                        }},
                        {'id': 'me21', 'type': 'fill_blank', 'payload': {
                            'sentence': '7 × ___ = 21',
                            'options': ['2', '3', '4'],
                            'correctAnswer': '3',
                            'translation': 'Find the missing factor',
                        }},
                    ]},
                ]},
            ],
        },
    ]
}

ACHIEVEMENTS = [
    {'id': 'first', 'title': 'First Steps', 'description': 'Complete your first lesson', 'icon': '👶', 'color': '#58cc02', 'rule_type': 'lessons', 'rule_value': 1},
    {'id': 'streak3', 'title': 'On Fire', 'description': 'Reach a 3-day streak', 'icon': '🔥', 'color': '#ff9600', 'rule_type': 'streak', 'rule_value': 3},
    {'id': 'xp50', 'title': 'Wordsmith', 'description': 'Earn 50 XP', 'icon': '✍️', 'color': '#1cb0f6', 'rule_type': 'xp', 'rule_value': 50},
    {'id': 'xp200', 'title': 'Scholar', 'description': 'Earn 200 XP', 'icon': '🎓', 'color': '#ce82ff', 'rule_type': 'xp', 'rule_value': 200},
    {'id': 'noMiss', 'title': 'Sharpshooter', 'description': 'Finish a lesson with 0 mistakes', 'icon': '🎯', 'color': '#ff4b4b', 'rule_type': 'perfect_lesson', 'rule_value': 1},
    {'id': 'week', 'title': 'Weekly Warrior', 'description': 'Reach a 7-day streak', 'icon': '🏆', 'color': '#ffc800', 'rule_type': 'streak', 'rule_value': 7},
    {'id': 'legendary', 'title': 'Legendary', 'description': 'Beat a legendary challenge', 'icon': '💎', 'color': '#a560e8', 'rule_type': 'legendary', 'rule_value': 1},
]

LEADERBOARD_SEED = [
    {'id': 'lb1', 'name': 'Sofia', 'xp': 2340, 'avatar': '🧑‍🎤'},
    {'id': 'lb2', 'name': 'Marco', 'xp': 1980, 'avatar': '🧑‍🎓'},
    {'id': 'lb3', 'name': 'Aiko', 'xp': 1720, 'avatar': '👩‍🎨'},
    {'id': 'lb4', 'name': 'Chen', 'xp': 1450, 'avatar': '🧑‍💻'},
    {'id': 'lb5', 'name': 'Priya', 'xp': 1210, 'avatar': '👩‍🔬'},
    {'id': 'lb6', 'name': 'Diego', 'xp': 980, 'avatar': '🧑‍🎤'},
    {'id': 'lb7', 'name': 'Emma', 'xp': 720, 'avatar': '👧'},
    {'id': 'lb8', 'name': 'Luis', 'xp': 540, 'avatar': '👦'},
    {'id': 'lb9', 'name': 'Nadia', 'xp': 410, 'avatar': '👩'},
    {'id': 'lb10', 'name': 'Kai', 'xp': 260, 'avatar': '🧒'},
]
