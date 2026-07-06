export const lessonCatalog = [
  {
    id: "equation-balance",
    title: "Balancing Equations",
    question: "How do you solve an equation by keeping both sides balanced?",
    formula: "x + 3 = 7, so x = 4",
    difficulty: "Algebra",
    minutes: 6
  },
  {
    id: "simultaneous-equations",
    title: "Simultaneous Equations",
    question: "How do you solve two equations for the same x and y values?",
    formula: "substitution, elimination, or graph intersection",
    difficulty: "Algebra",
    minutes: 10
  },
  {
    id: "matrix-operations",
    title: "Matrix Operations",
    question: "How do matrices use rows and columns for addition, subtraction, multiplication, and division?",
    formula: "same-size add/subtract, row-by-column multiply, inverse for division",
    difficulty: "Matrices",
    minutes: 10
  },
  {
    id: "distributive-property",
    title: "Distributive Property",
    question: "How does multiplication distribute across parentheses?",
    formula: "a(b + c) = ab + ac",
    difficulty: "Algebra",
    minutes: 6
  },
  {
    id: "factoring-quadratics",
    title: "Factoring Quadratics",
    question: "How can a quadratic be rewritten as two brackets?",
    formula: "x² + 5x + 6 = (x + 2)(x + 3)",
    difficulty: "Algebra",
    minutes: 8
  },
  {
    id: "common-factor",
    title: "Common Factor",
    question: "How do you factorise by taking out the greatest common factor?",
    formula: "6x + 9 = 3(2x + 3)",
    difficulty: "Algebra",
    minutes: 6
  },
  {
    id: "difference-of-squares",
    title: "Difference of Squares",
    question: "How do you factorise A² - B²?",
    formula: "x² - 9 = (x - 3)(x + 3)",
    difficulty: "Algebra",
    minutes: 6
  },
  {
    id: "factor-by-grouping",
    title: "Factor by Grouping",
    question: "How do you factorise four terms by grouping pairs?",
    formula: "ax + ay + bx + by = (a + b)(x + y)",
    difficulty: "Algebra",
    minutes: 7
  },
  {
    id: "completing-square",
    title: "Completing the Square",
    question: "How do you rewrite a quadratic as a completed square?",
    formula: "x² + 6x + 5 = (x + 3)² - 4",
    difficulty: "Algebra",
    minutes: 8
  },
  {
    id: "quadratic-identities",
    title: "Quadratic Formulas",
    question: "What are the common quadratic factoring identities?",
    formula: "x² - a², (x ± a)², and x² + (a + b)x + ab",
    difficulty: "Algebra",
    minutes: 8
  },
  {
    id: "cubic-identities",
    title: "Cubic Formulas",
    question: "What are the common cubic factoring identities?",
    formula: "(x ± a)³ and x³ ± a³ identities",
    difficulty: "Algebra",
    minutes: 9
  },
  {
    id: "power-identities",
    title: "Power Formulas",
    question: "How do nth-power factoring identities work?",
    formula: "x²ⁿ - a²ⁿ and odd-power sum/difference identities",
    difficulty: "Algebra",
    minutes: 10
  },
  {
    id: "triangle-area",
    title: "Area of a Triangle",
    question: "Why does 1/2 x base x height give the area of a triangle?",
    formula: "A = 1/2 x b x h",
    difficulty: "Foundations",
    minutes: 6
  },
  {
    id: "sas-area",
    title: "SAS Triangle Area",
    question: "Why is the area of a triangle 1/2 times two sides times the sine of the included angle?",
    formula: "A = 1/2 ab sin(C) = 1/2 bc sin(A) = 1/2 ac sin(B)",
    difficulty: "Trigonometry",
    minutes: 8
  },
  {
    id: "trig-ratios",
    title: "Sin, Cos, Tan",
    question: "What do sine, cosine, and tangent compare in a right triangle?",
    formula: "sin(theta)=opp/hyp, cos(theta)=adj/hyp, tan(theta)=opp/adj",
    difficulty: "Trigonometry",
    minutes: 7
  },
  {
    id: "sine-derived",
    title: "How Sine Is Derived",
    question: "Where does sine come from, and what is sin(1)?",
    formula: "sin(theta)=unit-circle y-coordinate; sin(1 radian) ~= 0.84147",
    difficulty: "Trigonometry",
    minutes: 8
  },
  {
    id: "pi-derived",
    title: "How Pi Is Derived",
    question: "How is pi related to circumference and perimeter?",
    formula: "pi = C / d, so C = pi d = 2 pi r",
    difficulty: "Geometry",
    minutes: 8
  },
  {
    id: "circle-area",
    title: "Area of a Circle",
    question: "How is the formula for area of a circle derived?",
    formula: "A = pi r²",
    difficulty: "Geometry",
    minutes: 8
  },
  {
    id: "sector-area",
    title: "Area of a Sector",
    question: "How do you find the area of a circle sector?",
    formula: "A = (theta / 360) pi r² or A = 1/2 r² theta",
    difficulty: "Geometry",
    minutes: 7
  },
  {
    id: "sector-perimeter",
    title: "Perimeter of a Sector",
    question: "How do you find the perimeter of a circle sector?",
    formula: "P = 2r + r theta",
    difficulty: "Geometry",
    minutes: 6
  },
  {
    id: "radians",
    title: "Radians",
    question: "What is a radian and how does it relate to arc length?",
    formula: "theta = arc / r, so arc = r theta",
    difficulty: "Geometry",
    minutes: 7
  },
  {
    id: "angle-from-arc",
    title: "Angle from Arc Length",
    question: "How do you calculate a central angle from arc length and radius?",
    formula: "arc = 2 pi r x theta / 360, then major angle = 360 - minor angle",
    difficulty: "Arc Length",
    minutes: 8
  }
];

export function findLessonSummary(id: string) {
  return lessonCatalog.find((lesson) => lesson.id === id);
}
