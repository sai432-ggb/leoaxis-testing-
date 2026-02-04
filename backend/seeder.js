const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/courseModel');
const User = require('./models/userModel');

dotenv.config();

// Sample courses data
const courses = [
  {
    name: "Python Programming Fundamentals",
    slug: "python-programming-fundamentals",
    description: "Master Python from basics to advanced concepts with hands-on projects",
    longDescription: "Comprehensive Python course covering variables, data types, control structures, functions, OOP, and more. Perfect for beginners and those looking to strengthen their foundation.",
    category: "Programming",
    programmingLanguage: "Python",
    level: "Beginner",
    thumbnail: "https://placehold.co/600x400/0284c7/ffffff?text=Python+Course",
    duration: 40,
    learningOutcomes: [
      "Write clean and efficient Python code",
      "Understand object-oriented programming concepts",
      "Build real-world Python applications",
      "Master data structures and algorithms in Python"
    ],
    prerequisites: ["Basic computer knowledge", "No prior programming experience required"],
    topics: [
      {
        title: "Introduction to Python",
        description: "Get started with Python syntax, variables, and data types",
        order: 1,
        duration: 120,
        content: {
          articleText: "Python is a high-level, interpreted programming language known for its simplicity and readability...",
          codeExamples: [
            {
              language: "python",
              code: "# Your first Python program\nprint('Hello, World!')\n\n# Variables and data types\nname = 'Leoaxis'\nage = 5\nis_learning = True",
              output: "Hello, World!"
            }
          ],
          resources: [
            { title: "Python Official Documentation", url: "https://docs.python.org", type: "documentation" },
            { title: "Python Tutorial for Beginners", url: "https://youtube.com", type: "video" }
          ]
        },
        quiz: {
          passingScore: 70,
          timeLimit: 15,
          questions: [
            {
              question: "What is Python?",
              options: [
                "A compiled programming language",
                "An interpreted high-level programming language",
                "A database management system",
                "An operating system"
              ],
              correctAnswer: 1,
              explanation: "Python is an interpreted, high-level programming language known for its simplicity and readability.",
              difficulty: "Easy",
              points: 10,
              tags: ["basics", "introduction"]
            },
            {
              question: "Which of the following is a valid variable name in Python?",
              options: ["2variable", "variable_name", "variable-name", "variable name"],
              correctAnswer: 1,
              explanation: "Variable names in Python can contain letters, numbers, and underscores, but cannot start with a number or contain spaces/hyphens.",
              difficulty: "Easy",
              points: 10,
              tags: ["variables", "syntax"]
            },
            {
              question: "What is the output of: print(type(5.0))",
              options: ["<class 'int'>", "<class 'float'>", "<class 'number'>", "<class 'decimal'>"],
              correctAnswer: 1,
              explanation: "5.0 is a floating-point number, so type() returns <class 'float'>",
              difficulty: "Easy",
              points: 10,
              tags: ["data types"]
            }
          ]
        },
        isLocked: false
      },
      {
        title: "Control Flow and Loops",
        description: "Master if-else statements, for loops, and while loops",
        order: 2,
        duration: 150,
        content: {
          articleText: "Control flow statements allow you to control the execution path of your program...",
          codeExamples: [
            {
              language: "python",
              code: "# If-else statement\nage = 18\nif age >= 18:\n    print('You are an adult')\nelse:\n    print('You are a minor')\n\n# For loop\nfor i in range(5):\n    print(i)",
              output: "You are an adult\n0\n1\n2\n3\n4"
            }
          ]
        },
        quiz: {
          passingScore: 70,
          timeLimit: 20,
          questions: [
            {
              question: "What will be the output of the following code?\nfor i in range(3):\n    print(i)",
              options: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
              correctAnswer: 0,
              explanation: "range(3) generates numbers from 0 to 2 (3 is excluded)",
              difficulty: "Medium",
              points: 15,
              tags: ["loops", "range"]
            },
            {
              question: "Which loop is used when you don't know how many iterations are needed?",
              options: ["for loop", "while loop", "do-while loop", "foreach loop"],
              correctAnswer: 1,
              explanation: "While loops are used when the number of iterations is not known in advance",
              difficulty: "Easy",
              points: 10,
              tags: ["loops", "concepts"]
            }
          ]
        },
        isLocked: false
      }
    ],
    isPublished: true,
    isFeatured: true,
    tags: ["python", "programming", "beginner"],
    seoKeywords: ["learn python", "python tutorial", "python course"]
  },
  {
    name: "Data Structures and Algorithms",
    slug: "data-structures-algorithms",
    description: "Master essential DSA concepts for technical interviews and competitive programming",
    longDescription: "Deep dive into arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming. Prepare for top tech company interviews.",
    category: "DSA",
    programmingLanguage: "Python",
    level: "Intermediate",
    thumbnail: "https://placehold.co/600x400/059669/ffffff?text=DSA+Course",
    duration: 60,
    learningOutcomes: [
      "Implement common data structures from scratch",
      "Solve complex algorithmic problems",
      "Analyze time and space complexity",
      "Ace technical interviews at top companies"
    ],
    prerequisites: ["Basic programming knowledge", "Understanding of Python or C++"],
    topics: [
      {
        title: "Arrays and Strings",
        description: "Master array manipulation and string algorithms",
        order: 1,
        duration: 180,
        content: {
          articleText: "Arrays are fundamental data structures that store elements in contiguous memory locations...",
          codeExamples: [
            {
              language: "python",
              code: "# Array operations\narr = [1, 2, 3, 4, 5]\nprint(arr[0])  # Access\narr.append(6)  # Insert\narr.remove(3)  # Delete",
              output: "1"
            }
          ]
        },
        quiz: {
          passingScore: 70,
          timeLimit: 25,
          questions: [
            {
              question: "What is the time complexity of accessing an element in an array by index?",
              options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
              correctAnswer: 0,
              explanation: "Array access by index is constant time O(1) because elements are stored contiguously in memory",
              difficulty: "Medium",
              points: 15,
              tags: ["arrays", "complexity"]
            },
            {
              question: "Which algorithm is best for finding duplicates in an unsorted array?",
              options: ["Linear search", "Binary search", "Hash table", "Bubble sort"],
              correctAnswer: 2,
              explanation: "Hash tables provide O(n) time complexity for finding duplicates by storing seen elements",
              difficulty: "Medium",
              points: 15,
              tags: ["algorithms", "hash"]
            }
          ]
        },
        isLocked: false
      }
    ],
    isPublished: true,
    isFeatured: true,
    tags: ["dsa", "algorithms", "interview-prep"],
    seoKeywords: ["data structures", "algorithms", "interview preparation"]
  },
  {
    name: "Web Development with JavaScript",
    slug: "web-development-javascript",
    description: "Build modern web applications with HTML, CSS, and JavaScript",
    longDescription: "Complete web development course covering HTML5, CSS3, JavaScript ES6+, DOM manipulation, and introduction to React.js",
    category: "Web Development",
    programmingLanguage: "JavaScript",
    level: "Beginner",
    thumbnail: "https://placehold.co/600x400/eab308/ffffff?text=Web+Dev+Course",
    duration: 50,
    learningOutcomes: [
      "Build responsive websites from scratch",
      "Master JavaScript fundamentals and ES6+ features",
      "Manipulate the DOM and handle events",
      "Create interactive web applications"
    ],
    prerequisites: ["Basic computer skills", "Interest in web development"],
    topics: [
      {
        title: "JavaScript Basics",
        description: "Learn variables, functions, and core JavaScript concepts",
        order: 1,
        duration: 120,
        content: {
          articleText: "JavaScript is the programming language of the web, enabling interactive and dynamic websites...",
          codeExamples: [
            {
              language: "javascript",
              code: "// Variables\nlet name = 'Leoaxis';\nconst year = 2024;\n\n// Functions\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Student'));",
              output: "Hello, Student!"
            }
          ]
        },
        quiz: {
          passingScore: 70,
          timeLimit: 15,
          questions: [
            {
              question: "What is the difference between 'let' and 'const'?",
              options: [
                "No difference",
                "let is for numbers, const for strings",
                "let can be reassigned, const cannot",
                "const is faster than let"
              ],
              correctAnswer: 2,
              explanation: "Variables declared with 'const' cannot be reassigned, while 'let' variables can be",
              difficulty: "Easy",
              points: 10,
              tags: ["variables", "ES6"]
            }
          ]
        },
        isLocked: false
      }
    ],
    isPublished: true,
    isFeatured: false,
    tags: ["javascript", "web-development", "frontend"],
    seoKeywords: ["learn javascript", "web development", "frontend development"]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected');

    // Clear existing data
    await Course.deleteMany();
    console.log('  Cleared existing courses');

    // Insert sample courses
    const createdCourses = await Course.insertMany(courses);
    console.log(` ${createdCourses.length} courses seeded successfully`);

    console.log('\n Seeded Courses:');
    createdCourses.forEach(course => {
      console.log(`  - ${course.name} (${course.level})`);
    });

    console.log('\n Database seeding completed!');
    process.exit(0);

  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
