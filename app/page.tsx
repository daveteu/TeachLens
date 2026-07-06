"use client";

import type { ReactNode } from "react";
import { isValidElement, useMemo, useState } from "react";

const triangleSteps = [
  {
    label: "Triangle",
    title: "Start with one triangle",
    text: "The base is the bottom edge. The height is the straight-up distance from the base to the opposite corner.",
    formula: "A = 1/2 x b x h"
  },
  {
    label: "Duplicate",
    title: "Make an identical copy",
    text: "If we copy the triangle, we now have two equal areas. The original triangle is exactly half of this pair.",
    formula: "2A = b x h"
  },
  {
    label: "Rearrange",
    title: "Fit the two triangles together",
    text: "The pair forms a parallelogram with the same base and height as the triangle setup.",
    formula: "parallelogram = b x h"
  },
  {
    label: "Formula",
    title: "Take half of base x height",
    text: "A parallelogram area is base x height. One triangle is half of that, so its area is 1/2 x base x height.",
    formula: "A = 1/2 x b x h"
  }
];

const sasSteps = [
  {
    label: "Angle C",
    title: "Use sides a and b around angle C",
    text: "Sides a and b meet at angle C. If b is the base, the height is the part of side a that rises above b, which is a x sin(C).",
    formula: "Area = 1/2 ab x sin(C)"
  },
  {
    label: "Angle A",
    title: "Use sides b and c around angle A",
    text: "Sides b and c meet at angle A. If c is the base, the matching height is b x sin(A).",
    formula: "Area = 1/2 bc x sin(A)"
  },
  {
    label: "Angle B",
    title: "Use sides a and c around angle B",
    text: "Sides a and c meet at angle B. If a is the base, the matching height is c x sin(B).",
    formula: "Area = 1/2 ac x sin(B)"
  },
  {
    label: "Same Area",
    title: "Three views of the same triangle",
    text: "Each formula chooses two sides and the included angle between them. The sine converts one side into the perpendicular height.",
    formula: "1/2 ab sin(C) = 1/2 bc sin(A) = 1/2 ac sin(B)"
  }
];

const trigSteps = [
  {
    label: "Sides",
    title: "Name the sides from one angle",
    text: "Pick an angle first. The hypotenuse is across from the right angle, the opposite side is across from your chosen angle, and the adjacent side touches it.",
    formula: "opposite, adjacent, hypotenuse"
  },
  {
    label: "Sine",
    title: "Sine compares opposite to hypotenuse",
    text: "Sine tells you what fraction of the hypotenuse shows up as height opposite the angle.",
    formula: "sin(theta) = opposite / hypotenuse"
  },
  {
    label: "Cosine",
    title: "Cosine compares adjacent to hypotenuse",
    text: "Cosine tells you what fraction of the hypotenuse lies along the base next to the angle.",
    formula: "cos(theta) = adjacent / hypotenuse"
  },
  {
    label: "Tangent",
    title: "Tangent compares opposite to adjacent",
    text: "Tangent ignores the hypotenuse and compares the rise to the run from the chosen angle.",
    formula: "tan(theta) = opposite / adjacent"
  }
];

const sineDerivedSteps = [
  {
    label: "Circle",
    title: "Start with a unit circle",
    text: "A unit circle has radius 1. Put a point on the circle by rotating a radius through an angle theta.",
    formula: "radius = 1"
  },
  {
    label: "Height",
    title: "Sine is the vertical height",
    text: "Drop a vertical line from the point to the x-axis. Because the hypotenuse is 1, opposite divided by hypotenuse is just the vertical height.",
    formula: "sin(theta) = y / 1 = y"
  },
  {
    label: "Radian",
    title: "What does sin(1) mean?",
    text: "In most math and programming contexts, sin(1) means sine of 1 radian. One radian is the angle made when the arc length equals the radius.",
    formula: "sin(1 radian) ~= 0.84147"
  },
  {
    label: "Degree",
    title: "Sin of 1 degree is different",
    text: "If you mean 1 degree, the angle is much smaller. Always write the unit when teaching or calculating.",
    formula: "sin(1 degree) ~= 0.01745"
  }
];

const piSteps = [
  {
    label: "Measure",
    title: "Pi starts by measuring a circle",
    text: "Take any circle and measure straight across the middle. That distance is the diameter.",
    formula: "diameter = d"
  },
  {
    label: "Unwrap",
    title: "Unwrap the circumference",
    text: "The circumference is the perimeter of a circle. If you could unwrap the rim into a straight line, it would be a little more than three diameters long.",
    formula: "circumference ~= 3.14159 diameters"
  },
  {
    label: "Ratio",
    title: "Pi is the constant ratio",
    text: "For every circle, circumference divided by diameter gives the same number. That number is pi.",
    formula: "pi = C / d"
  },
  {
    label: "Perimeter",
    title: "Polygons approach the circle",
    text: "A polygon has a perimeter made from straight sides. As we use more sides around the same circle, the polygon perimeter gets closer to the circle circumference.",
    formula: "as sides increase, perimeter -> C"
  },
  {
    label: "Formula",
    title: "Circumference is circle perimeter",
    text: "Since pi is C divided by diameter, rearranging gives C = pi times d. Because diameter is two radii, C = 2 pi r.",
    formula: "C = pi d = 2 pi r"
  }
];

const circleAreaSteps = [
  {
    label: "Circle",
    title: "Start with radius and circumference",
    text: "A circle has radius r. Its outside edge is the circumference, which is 2 pi r.",
    formula: "C = 2 pi r"
  },
  {
    label: "Slices",
    title: "Cut the circle into equal wedges",
    text: "Imagine slicing the circle like a pizza. Each wedge has height close to r, from the center to the rim.",
    formula: "wedge height ~= r"
  },
  {
    label: "Rearrange",
    title: "Alternate the wedges",
    text: "Move every other wedge down. The curved edges spread across the top and bottom, forming an almost-rectangle.",
    formula: "top + bottom = 2 pi r"
  },
  {
    label: "Half Edge",
    title: "One long edge is half the circumference",
    text: "The top edge is made from half the circle's rim, so its length is pi r. The height is r.",
    formula: "base = C / 2 = pi r"
  },
  {
    label: "Area",
    title: "Rectangle area gives circle area",
    text: "The rearranged shape has the same area as the circle. Its area is base times height: pi r times r.",
    formula: "A = pi r x r = pi r²"
  }
];

const sectorAreaSteps = [
  {
    label: "Sector",
    title: "A sector is a slice of a circle",
    text: "A sector is made by two radii and the arc between them. It is like a pizza slice from the circle.",
    formula: "sector angle = theta"
  },
  {
    label: "Fraction",
    title: "Compare the angle to a full turn",
    text: "The sector is the same fraction of the circle as its angle is of a full 360 degree turn.",
    formula: "sector / circle = theta / 360"
  },
  {
    label: "Area",
    title: "Take that fraction of circle area",
    text: "Circle area is pi r², so sector area is the angle fraction times pi r².",
    formula: "A = (theta / 360) pi r²"
  },
  {
    label: "Radians",
    title: "In radians the formula is shorter",
    text: "A full turn is 2 pi radians, so the same formula becomes one half r squared theta.",
    formula: "A = 1/2 r² theta"
  }
];

const sectorPerimeterSteps = [
  {
    label: "Boundary",
    title: "Sector perimeter is the outside boundary",
    text: "Walk around a sector: radius, arc, radius. Add those three parts.",
    formula: "P = r + arc + r"
  },
  {
    label: "Arc",
    title: "Find the arc length",
    text: "The arc is the curved part of the perimeter. In radians, arc length is radius times angle.",
    formula: "arc = r theta"
  },
  {
    label: "Add",
    title: "Add two radii and the arc",
    text: "The full perimeter is two straight radius edges plus the curved arc.",
    formula: "P = 2r + r theta"
  }
];

const radianSteps = [
  {
    label: "Idea",
    title: "A radian measures angle using arc length",
    text: "Instead of degrees, radians compare the arc length to the radius.",
    formula: "theta = arc / r"
  },
  {
    label: "One",
    title: "One radian means arc equals radius",
    text: "If the arc length is exactly one radius long, the angle is 1 radian.",
    formula: "1 radian: arc = r"
  },
  {
    label: "Full Turn",
    title: "A full circle is 2 pi radians",
    text: "A full circumference is 2 pi r. Divide by r and the full angle is 2 pi radians.",
    formula: "full turn = 2 pi radians"
  },
  {
    label: "Bridge",
    title: "Radians connect directly to formulas",
    text: "Because theta equals arc divided by radius, formulas like arc = r theta and sector area = 1/2 r² theta become natural.",
    formula: "arc = r theta"
  }
];

const equationBalanceSteps = [
  {
    label: "Equation",
    title: "An equation is a balance",
    text: "Both sides of an equation must stay equal. Think of the equals sign as the center of a scale.",
    formula: "x + 3 = 7"
  },
  {
    label: "Undo",
    title: "Undo the extra number",
    text: "To isolate x, remove 3 from the left. To keep balance, remove 3 from the right too.",
    formula: "x + 3 - 3 = 7 - 3"
  },
  {
    label: "Solve",
    title: "Read what remains",
    text: "The left side is now just x. The right side is 4, so x must be 4.",
    formula: "x = 4"
  }
];

const simultaneousSteps = [
  {
    label: "System",
    title: "Two equations, one shared answer",
    text: "A simultaneous equation asks for values of x and y that make both equations true at the same time.",
    formula: "x + y = 7, x - y = 1"
  },
  {
    label: "Substitute",
    title: "Replace one variable",
    text: "Substitution works well when one equation already tells you what x or y equals.",
    formula: "y = 2x + 1"
  },
  {
    label: "Eliminate",
    title: "Remove one variable",
    text: "Elimination works well when adding or subtracting the equations makes one variable disappear.",
    formula: "(2x + y) - (x + y)"
  },
  {
    label: "Graph",
    title: "Find the crossing point",
    text: "Each linear equation is a line. The solution is the point where both lines meet.",
    formula: "(x, y)"
  },
  {
    label: "Check",
    title: "Substitute back into both equations",
    text: "A solution is only correct if it satisfies every equation in the system.",
    formula: "x = 4, y = 3"
  }
];

const matrixOperationSteps = [
  {
    label: "Matrix",
    title: "A matrix is a number grid",
    text: "A matrix stores numbers in rows and columns. The size is written as rows by columns.",
    formula: "A is 2 × 2"
  },
  {
    label: "Add",
    title: "Add matching positions",
    text: "Matrix addition is entry by entry. The matrices must have the same size.",
    formula: "A + B = [aᵢⱼ + bᵢⱼ]"
  },
  {
    label: "Subtract",
    title: "Subtract matching positions",
    text: "Matrix subtraction uses the same position-by-position idea, but subtracts each matching entry.",
    formula: "A - B = [aᵢⱼ - bᵢⱼ]"
  },
  {
    label: "Multiply",
    title: "Multiply rows by columns",
    text: "To multiply matrices, match each row of the first matrix with each column of the second matrix.",
    formula: "(AB)ᵢⱼ = row i × column j"
  },
  {
    label: "Divide",
    title: "Use an inverse instead of division",
    text: "Matrices do not have direct division. Dividing by a matrix means multiplying by its inverse, if that inverse exists.",
    formula: "A ÷ B means A × B⁻¹"
  },
  {
    label: "Rules",
    title: "Check the size rules first",
    text: "Addition and subtraction need identical sizes. Multiplication needs columns of the first matrix to match rows of the second.",
    formula: "2 × 3 times 3 × 2 gives 2 × 2"
  }
];

const distributiveSteps = [
  {
    label: "Group",
    title: "Start with a grouped expression",
    text: "The number outside the parentheses multiplies the whole group inside.",
    formula: "3(x + 2)"
  },
  {
    label: "Share",
    title: "Distribute to each term",
    text: "Multiply 3 by the variable x, then multiply 3 by 2. The multiplication sign is used only while showing the action.",
    formula: "3 × x + 3 × 2"
  },
  {
    label: "Simplify",
    title: "Combine the products",
    text: "After distributing, the expression becomes 3x + 6.",
    formula: "3(x + 2) = 3x + 6"
  }
];

const factoringSteps = [
  {
    label: "Expression",
    title: "Start with a quadratic",
    text: "A quadratic like x² + 5x + 6 can be built from two binomial factors.",
    formula: "x² + 5x + 6"
  },
  {
    label: "Find Pair",
    title: "Find two numbers",
    text: "Look for two numbers that multiply to 6 and add to 5. The pair is 2 and 3.",
    formula: "2 × 3 = 6, 2 + 3 = 5"
  },
  {
    label: "Factor",
    title: "Write the two brackets",
    text: "Those numbers become the constants in the brackets: x + 2 and x + 3.",
    formula: "x² + 5x + 6 = (x + 2)(x + 3)"
  }
];

const commonFactorSteps = [
  {
    label: "Spot",
    title: "Spot the shared factor",
    text: "Look for something every term has in common. In 6x + 9, both terms share 3.",
    formula: "6x + 9"
  },
  {
    label: "Take Out",
    title: "Take the common factor outside",
    text: "Put the shared factor outside brackets, then divide each term by that factor.",
    formula: "3(2x + 3)"
  },
  {
    label: "Check",
    title: "Check by expanding",
    text: "Expanding 3(2x + 3) gives 6x + 9, so the factorisation is correct.",
    formula: "3(2x + 3) = 6x + 9"
  }
];

const differenceSquaresSteps = [
  {
    label: "Pattern",
    title: "Recognise two squares",
    text: "A difference of squares has one square minus another square.",
    formula: "x² - 9"
  },
  {
    label: "Roots",
    title: "Find the square roots",
    text: "The square roots are x and 3, because x² is x squared and 9 is 3 squared.",
    formula: "x² - 3²"
  },
  {
    label: "Factor",
    title: "Use opposite signs",
    text: "A² - B² factors into (A - B)(A + B).",
    formula: "x² - 9 = (x - 3)(x + 3)"
  }
];

const groupingSteps = [
  {
    label: "Group",
    title: "Split into two pairs",
    text: "For four terms, group the first two and the last two.",
    formula: "ax + ay + bx + by"
  },
  {
    label: "Factor Pairs",
    title: "Factor each pair",
    text: "Take out the common factor from each pair. Both pairs should reveal the same bracket.",
    formula: "a(x + y) + b(x + y)"
  },
  {
    label: "Finish",
    title: "Factor the shared bracket",
    text: "The repeated bracket becomes one factor, and the outside terms become the other factor.",
    formula: "(a + b)(x + y)"
  }
];

const completingSquareSteps = [
  {
    label: "Start",
    title: "Start with x² plus x terms",
    text: "Completing the square rewrites a quadratic around a perfect square bracket.",
    formula: "x² + 6x + 5"
  },
  {
    label: "Half",
    title: "Half the x coefficient",
    text: "Half of 6 is 3. The perfect square starts as (x + 3)².",
    formula: "(x + 3)²"
  },
  {
    label: "Adjust",
    title: "Adjust the extra amount",
    text: "(x + 3)² equals x² + 6x + 9, so subtract 4 to get back to +5.",
    formula: "x² + 6x + 5 = (x + 3)² - 4"
  },
  {
    label: "Optional",
    title: "Then factor if needed",
    text: "Now use difference of squares: (x + 3)² - 2².",
    formula: "(x + 1)(x + 5)"
  }
];

const quadraticIdentitySteps = [
  {
    label: "Diff Squares",
    title: "Difference of two squares",
    text: "When two squared terms are subtracted, they factor into matching brackets with opposite signs.",
    formula: "x² - a² = (x + a)(x - a)"
  },
  {
    label: "Plus Square",
    title: "Perfect square with a plus sign",
    text: "The middle term is twice the product of x and a, so the expression folds into one squared bracket.",
    formula: "x² + 2ax + a² = (x + a)²"
  },
  {
    label: "Minus Square",
    title: "Perfect square with a minus sign",
    text: "The negative middle term means the repeated bracket uses x - a.",
    formula: "x² - 2ax + a² = (x - a)²"
  },
  {
    label: "Trinomial",
    title: "General two-number trinomial",
    text: "If the middle coefficient is a + b and the constant is ab, the brackets are x + a and x + b.",
    formula: "x² + (a + b)x + ab = (x + a)(x + b)"
  }
];

const cubicIdentitySteps = [
  {
    label: "Cube Plus",
    title: "Perfect cube with a plus sign",
    text: "The coefficients 1, 3, 3, 1 come from expanding (x + a) three times.",
    formula: "x³ + 3ax² + 3a²x + a³ = (x + a)³"
  },
  {
    label: "Cube Minus",
    title: "Perfect cube with a minus sign",
    text: "The signs alternate when the bracket is x - a.",
    formula: "x³ - 3ax² + 3a²x - a³ = (x - a)³"
  },
  {
    label: "Sum Cubes",
    title: "Sum of cubes",
    text: "A sum of cubes has a linear factor x + a and a quadratic factor with alternating signs.",
    formula: "x³ + a³ = (x + a)(x² - ax + a²)"
  },
  {
    label: "Diff Cubes",
    title: "Difference of cubes",
    text: "A difference of cubes has a linear factor x - a and a quadratic factor with all positive middle pattern.",
    formula: "x³ - a³ = (x - a)(x² + ax + a²)"
  }
];

const powerIdentitySteps = [
  {
    label: "Even Power",
    title: "Even powers split as squares",
    text: "Because x²ⁿ and a²ⁿ are both square-like powers, they factor as a difference of squares.",
    formula: "x²ⁿ - a²ⁿ = (xⁿ - aⁿ)(xⁿ + aⁿ)"
  },
  {
    label: "Odd Minus",
    title: "Odd power difference",
    text: "For odd n, xⁿ - aⁿ has factor x - a and a descending sum of powers.",
    formula: "xⁿ - aⁿ = (x - a)(xⁿ⁻¹ + axⁿ⁻² + ... + aⁿ⁻¹)"
  },
  {
    label: "Odd Plus",
    title: "Odd power sum",
    text: "For odd n, xⁿ + aⁿ has factor x + a and an alternating-sign power pattern.",
    formula: "xⁿ + aⁿ = (x + a)(xⁿ⁻¹ - axⁿ⁻² + a²xⁿ⁻³ - ... + aⁿ⁻¹)"
  }
];

const lessons = [
  {
    id: "equation-balance",
    title: "Balancing Equations",
    category: "Algebra",
    eyebrow: "Solve for x",
    steps: equationBalanceSteps
  },
  {
    id: "simultaneous-equations",
    title: "Simultaneous Equations",
    category: "Algebra",
    eyebrow: "Solve systems",
    steps: simultaneousSteps
  },
  {
    id: "matrix-operations",
    title: "Matrix Operations",
    category: "Matrices",
    eyebrow: "Rows and columns",
    steps: matrixOperationSteps
  },
  {
    id: "distributive-property",
    title: "Distributive Property",
    category: "Algebra",
    eyebrow: "Expand brackets",
    steps: distributiveSteps
  },
  {
    id: "factoring-quadratics",
    title: "Factoring Quadratics",
    category: "Algebra",
    eyebrow: "Reverse expansion",
    steps: factoringSteps
  },
  {
    id: "common-factor",
    title: "Common Factor",
    category: "Algebra",
    eyebrow: "Factorising method",
    steps: commonFactorSteps
  },
  {
    id: "difference-of-squares",
    title: "Difference of Squares",
    category: "Algebra",
    eyebrow: "Factorising method",
    steps: differenceSquaresSteps
  },
  {
    id: "factor-by-grouping",
    title: "Factor by Grouping",
    category: "Algebra",
    eyebrow: "Factorising method",
    steps: groupingSteps
  },
  {
    id: "completing-square",
    title: "Completing the Square",
    category: "Algebra",
    eyebrow: "Quadratic form",
    steps: completingSquareSteps
  },
  {
    id: "quadratic-identities",
    title: "Quadratic Formulas",
    category: "Algebra",
    eyebrow: "Factoring formulas",
    steps: quadraticIdentitySteps
  },
  {
    id: "cubic-identities",
    title: "Cubic Formulas",
    category: "Algebra",
    eyebrow: "Factoring formulas",
    steps: cubicIdentitySteps
  },
  {
    id: "power-identities",
    title: "Power Formulas",
    category: "Algebra",
    eyebrow: "Factoring formulas",
    steps: powerIdentitySteps
  },
  {
    id: "triangle-area",
    title: "Area of a Triangle",
    category: "Geometry",
    eyebrow: "Animated proof",
    steps: triangleSteps
  },
  {
    id: "sas-area",
    title: "SAS Triangle Area",
    category: "Trigonometry",
    eyebrow: "Sine area formula",
    steps: sasSteps
  },
  {
    id: "trig-ratios",
    title: "Sin, Cos, Tan",
    category: "Trigonometry",
    eyebrow: "Right triangle ratios",
    steps: trigSteps
  },
  {
    id: "sine-derived",
    title: "How Sine Is Derived",
    category: "Trigonometry",
    eyebrow: "Unit circle meaning",
    steps: sineDerivedSteps
  },
  {
    id: "pi-derived",
    title: "How Pi Is Derived",
    category: "Circles",
    eyebrow: "Circumference and perimeter",
    steps: piSteps
  },
  {
    id: "circle-area",
    title: "Area of a Circle",
    category: "Circles",
    eyebrow: "Wedges to rectangle",
    steps: circleAreaSteps
  },
  {
    id: "sector-area",
    title: "Area of a Sector",
    category: "Circles",
    eyebrow: "Circle slice",
    steps: sectorAreaSteps
  },
  {
    id: "sector-perimeter",
    title: "Perimeter of a Sector",
    category: "Circles",
    eyebrow: "Arc plus radii",
    steps: sectorPerimeterSteps
  },
  {
    id: "radians",
    title: "Radians",
    category: "Circles",
    eyebrow: "Angle from arc length",
    steps: radianSteps
  }
];

const lessonCategories = ["Algebra", "Matrices", "Geometry", "Trigonometry", "Circles"];

type LessonWriteup = {
  title: string;
  intro: string;
  sections: {
    heading: string;
    body: ReactNode;
    visual?: ReactNode;
    math: ReactNode[];
  }[];
};

const lessonWriteups: Record<string, LessonWriteup> = {
  "equation-balance": {
    title: "Worked Example",
    intro: "Solve x + 3 = 7 by doing the same operation to both sides.",
    sections: [
      {
        heading: "Step 1: Start with the equation",
        body: "The equals sign means both sides have the same value.",
        math: [
          <MathLine key="start">
            x + 3 = 7
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Undo the extra number",
        body: "The variable has 3 added to it, so subtract 3 from the left side.",
        math: [
          <MathLine key="left">
            x + 3 - 3
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Keep the equation balanced",
        body: "Whatever you do to one side, do to the other side too.",
        math: [
          <MathLine key="both">
            x + 3 - 3 = 7 - 3
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Simplify",
        body: "The +3 and -3 cancel. The remaining value of x is the solution.",
        math: [
          <MathLine key="answer">
            x = 4
          </MathLine>
        ]
      }
    ]
  },
  "simultaneous-equations": {
    title: "Worked Examples",
    intro: "A simultaneous-equation solution must make both equations true at the same time. Different systems are easier with different methods.",
    sections: [
      {
        heading: "Step 1: Understand what the answer means",
        body: "The answer is an ordered pair. It gives one value for x and one value for y.",
        math: [
          <MathLine key="system-one">
            x + y = 7
          </MathLine>,
          <MathLine key="system-two">
            x - y = 1
          </MathLine>,
          <MathLine key="solution-meaning">
            solution = (x, y)
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Use substitution when a variable is already isolated",
        body: "If one equation already says what y equals, put that expression into the other equation.",
        math: [
          <MathLine key="sub-one">
            y = 2x + 1
          </MathLine>,
          <MathLine key="sub-two">
            x + y = 10
          </MathLine>,
          <MathLine key="sub-three">
            x + (2x + 1) = 10
          </MathLine>,
          <MathLine key="sub-four">
            3x + 1 = 10
          </MathLine>,
          <MathLine key="sub-five">
            3x = 9
          </MathLine>,
          <MathLine key="sub-six">
            x = 3
          </MathLine>,
          <MathLine key="sub-seven">
            y = 2(3) + 1 = 7
          </MathLine>,
          <MathLine key="sub-answer">
            solution = (3, 7)
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Use elimination when variables line up",
        body: "If the same variable appears in both equations, subtract or add the equations to remove it.",
        math: [
          <MathLine key="elim-one">
            2x + y = 11
          </MathLine>,
          <MathLine key="elim-two">
            x + y = 7
          </MathLine>,
          <MathLine key="elim-three">
            (2x + y) - (x + y) = 11 - 7
          </MathLine>,
          <MathLine key="elim-four">
            x = 4
          </MathLine>,
          <MathLine key="elim-five">
            4 + y = 7
          </MathLine>,
          <MathLine key="elim-six">
            y = 3
          </MathLine>,
          <MathLine key="elim-answer">
            solution = (4, 3)
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Use graphing to see the intersection",
        body: "Each equation is a line. The crossing point gives the same x and y for both lines.",
        math: [
          <MathLine key="graph-one">
            y = x + 1
          </MathLine>,
          <MathLine key="graph-two">
            y = -x + 5
          </MathLine>,
          <MathLine key="graph-three">
            x + 1 = -x + 5
          </MathLine>,
          <MathLine key="graph-four">
            2x = 4
          </MathLine>,
          <MathLine key="graph-five">
            x = 2
          </MathLine>,
          <MathLine key="graph-six">
            y = 3
          </MathLine>,
          <MathLine key="graph-answer">
            intersection = (2, 3)
          </MathLine>
        ]
      },
      {
        heading: "Step 5: Check the answer in both equations",
        body: "Substitute the pair back into every equation. Both equations must be true.",
        math: [
          <MathLine key="check-one">
            2(4) + 3 = 11
          </MathLine>,
          <MathLine key="check-two">
            4 + 3 = 7
          </MathLine>,
          <MathLine key="check-three">
            (4, 3) works for both equations
          </MathLine>
        ]
      }
    ]
  },
  "matrix-operations": {
    title: "Worked Examples",
    intro: "Matrix operations are mostly size rules plus careful entry-by-entry arithmetic. Multiplication is the exception: it uses rows from the first matrix and columns from the second.",
    sections: [
      {
        heading: "Step 1: Read the matrix size",
        body: "Count rows first, then columns. This matrix has 2 rows and 2 columns.",
        math: [
          <MathLine key="matrix-size">
            A <MathOp>=</MathOp> <Matrix rows={[[1, 2], [3, 4]]} />
          </MathLine>,
          <MathLine key="matrix-order">
            size of A <MathOp>=</MathOp> 2 <MathOp>×</MathOp> 2
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Add matching entries",
        body: "Addition only works when both matrices have the same size. Add each position to its matching position.",
        math: [
          <MathLine key="matrix-add-start">
            <Matrix rows={[[1, 2], [3, 4]]} /> <MathOp>+</MathOp> <Matrix rows={[[5, 6], [7, 8]]} />
          </MathLine>,
          <MathLine key="matrix-add-work">
            <Matrix rows={[["1 + 5", "2 + 6"], ["3 + 7", "4 + 8"]]} />
          </MathLine>,
          <MathLine key="matrix-add-answer">
            <Matrix rows={[[6, 8], [10, 12]]} />
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Subtract matching entries",
        body: "Subtraction also needs the same size. Keep the order: first matrix minus second matrix.",
        math: [
          <MathLine key="matrix-sub-start">
            <Matrix rows={[[5, 6], [7, 8]]} /> <MathOp>-</MathOp> <Matrix rows={[[1, 2], [3, 4]]} />
          </MathLine>,
          <MathLine key="matrix-sub-work">
            <Matrix rows={[["5 - 1", "6 - 2"], ["7 - 3", "8 - 4"]]} />
          </MathLine>,
          <MathLine key="matrix-sub-answer">
            <Matrix rows={[[4, 4], [4, 4]]} />
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Multiply rows by columns",
        body: "Each answer entry comes from one row and one column. Write each product-sum on its own line so the row-column matches stay visible.",
        math: [
          <MathLine key="matrix-mul-start">
            <Matrix rows={[[1, 2], [3, 4]]} /> <MathOp>×</MathOp> <Matrix rows={[[2, 0], [1, 2]]} />
          </MathLine>,
          <MathLine key="matrix-mul-a">
            top left <MathOp>=</MathOp> 1<MathOp>×</MathOp>2 <MathOp>+</MathOp> 2<MathOp>×</MathOp>1 <MathOp>=</MathOp> 4
          </MathLine>,
          <MathLine key="matrix-mul-b">
            top right <MathOp>=</MathOp> 1<MathOp>×</MathOp>0 <MathOp>+</MathOp> 2<MathOp>×</MathOp>2 <MathOp>=</MathOp> 4
          </MathLine>,
          <MathLine key="matrix-mul-c">
            bottom left <MathOp>=</MathOp> 3<MathOp>×</MathOp>2 <MathOp>+</MathOp> 4<MathOp>×</MathOp>1 <MathOp>=</MathOp> 10
          </MathLine>,
          <MathLine key="matrix-mul-d">
            bottom right <MathOp>=</MathOp> 3<MathOp>×</MathOp>0 <MathOp>+</MathOp> 4<MathOp>×</MathOp>2 <MathOp>=</MathOp> 8
          </MathLine>,
          <MathLine key="matrix-mul-answer">
            <Matrix rows={[[4, 4], [10, 8]]} />
          </MathLine>
        ]
      },
      {
        heading: "Step 5: Divide by using an inverse",
        body: "There is no direct matrix division. If B has an inverse, divide by B by multiplying by B inverse.",
        math: [
          <MathLine key="matrix-div-not">
            A <MathOp>÷</MathOp> B is not a direct operation
          </MathLine>,
          <MathLine key="matrix-div-meaning">
            A <MathOp>÷</MathOp> B means A <MathOp>×</MathOp> B<sup>-1</sup>
          </MathLine>,
          <MathLine key="matrix-div-solve">
            AX <MathOp>=</MathOp> C, so X <MathOp>=</MathOp> A<sup>-1</sup>C
          </MathLine>
        ]
      },
      {
        heading: "Step 6: Check whether the operation is allowed",
        body: "Before calculating, check the sizes. This prevents most matrix mistakes.",
        math: [
          <MathLine key="matrix-rule-add">
            add or subtract: 2 <MathOp>×</MathOp> 2 with 2 <MathOp>×</MathOp> 2
          </MathLine>,
          <MathLine key="matrix-rule-multiply">
            multiply: 2 <MathOp>×</MathOp> 3 with 3 <MathOp>×</MathOp> 2 gives 2 <MathOp>×</MathOp> 2
          </MathLine>,
          <MathLine key="matrix-rule-inverse">
            inverse: only square matrices can have B<sup>-1</sup>
          </MathLine>
        ]
      }
    ]
  },
  "distributive-property": {
    title: "Worked Example",
    intro: "Expand 3(x + 2) by multiplying the outside number into every term inside the bracket.",
    sections: [
      {
        heading: "Step 1: Identify the outside factor",
        body: "The 3 outside the bracket multiplies the whole group.",
        math: [
          <MathLine key="start">
            3(x + 2)
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Multiply the first term",
        body: "Multiply 3 by x. The variable x is italic, while the multiplication sign is upright.",
        math: [
          <MathLine key="first">
            3<MathOp>×</MathOp><MathVar>x</MathVar><MathOp>=</MathOp>3<MathVar>x</MathVar>
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Multiply the second term",
        body: "The 3 must also multiply the 2 inside the bracket.",
        math: [
          <MathLine key="second">
            3<MathOp>×</MathOp>2<MathOp>=</MathOp>6
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Combine the products",
        body: "Put both multiplied parts back together with the same plus sign.",
        math: [
          <MathLine key="finish">
            3(<MathVar>x</MathVar> <MathOp>+</MathOp> 2)<MathOp>=</MathOp>3<MathVar>x</MathVar> <MathOp>+</MathOp> 6
          </MathLine>
        ]
      }
    ]
  },
  "factoring-quadratics": {
    title: "Worked Example",
    intro: "Factor x² + 5x + 6 by finding the two bracket numbers.",
    sections: [
      {
        heading: "Step 1: Start with the quadratic",
        body: "For x² + bx + c, we look for two numbers that build the middle and constant terms.",
        math: [
          <MathLine key="start">
            x<sup>2</sup> + 5x + 6
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Find numbers that multiply to the constant",
        body: "The constant is 6, so list factor pairs of 6.",
        math: [
          <MathLine key="multiply-one">
            1<MathOp>×</MathOp>6<MathOp>=</MathOp>6
          </MathLine>,
          <MathLine key="multiply-two">
            2<MathOp>×</MathOp>3<MathOp>=</MathOp>6
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Choose the pair that adds to the x coefficient",
        body: "The middle coefficient is 5. The pair 2 and 3 multiplies to 6 and adds to 5.",
        math: [
          <MathLine key="add">
            2<MathOp>+</MathOp>3<MathOp>=</MathOp>5
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Write the factors",
        body: "Use the two numbers as the constants in the two brackets.",
        math: [
          <MathLine key="finish">
            x<sup>2</sup> + 5x + 6 = (x + 2)(x + 3)
          </MathLine>
        ]
      }
    ]
  },
  "common-factor": {
    title: "Worked Example",
    intro: "Factor 6x + 9 by taking out the greatest common factor.",
    sections: [
      {
        heading: "Step 1: Look at each term",
        body: "The expression has two terms. Each term has a factor of 3.",
        math: [
          <MathLine key="start">
            6x + 9
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Rewrite each term using the common factor",
        body: "Write both terms as 3 multiplied by something.",
        math: [
          <MathLine key="rewrite">
            6<MathVar>x</MathVar> <MathOp>+</MathOp> 9<MathOp>=</MathOp>3<MathOp>×</MathOp>2<MathVar>x</MathVar> <MathOp>+</MathOp> 3<MathOp>×</MathOp>3
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Move the common factor outside",
        body: "The repeated factor goes outside the bracket. The leftover parts stay inside.",
        math: [
          <MathLine key="factor">
            3<MathOp>×</MathOp>2<MathVar>x</MathVar> <MathOp>+</MathOp> 3<MathOp>×</MathOp>3<MathOp>=</MathOp>3(2<MathVar>x</MathVar> <MathOp>+</MathOp> 3)
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Check by expanding",
        body: "Multiply the 3 back in to confirm that the original expression returns.",
        math: [
          <MathLine key="check">
            3(2<MathVar>x</MathVar> <MathOp>+</MathOp> 3)<MathOp>=</MathOp>6<MathVar>x</MathVar> <MathOp>+</MathOp> 9
          </MathLine>
        ]
      }
    ]
  },
  "difference-of-squares": {
    title: "Worked Example",
    intro: "Factor x² - 9 by recognising it as one square minus another square.",
    sections: [
      {
        heading: "Step 1: Recognise the pattern",
        body: "A difference of squares has the form A² - B².",
        math: [
          <MathLine key="pattern">
            A<sup>2</sup> - B<sup>2</sup> = (A + B)(A - B)
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Rewrite both parts as squares",
        body: "The first square is x². The number 9 is 3².",
        math: [
          <MathLine key="rewrite">
            x<sup>2</sup> - 9 = x<sup>2</sup> - 3<sup>2</sup>
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Identify A and B",
        body: "Here, A is x and B is 3.",
        math: [
          <MathLine key="identify-a">
            A = x
          </MathLine>,
          <MathLine key="identify-b">
            B = 3
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Use opposite signs",
        body: "The factors use the same two terms, one with plus and one with minus.",
        math: [
          <MathLine key="finish">
            x<sup>2</sup> - 9 = (x + 3)(x - 3)
          </MathLine>
        ]
      }
    ]
  },
  "factor-by-grouping": {
    title: "Worked Example",
    intro: "Factor ax + ay + bx + by by grouping pairs that share common factors.",
    sections: [
      {
        heading: "Step 1: Split the expression into two groups",
        body: "Group the first two terms and the last two terms.",
        math: [
          <MathLine key="group">
            ax + ay + bx + by = (ax + ay) + (bx + by)
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Factor each group",
        body: "Take out a from the first group and b from the second group.",
        math: [
          <MathLine key="factor-pairs">
            (ax + ay) + (bx + by) = a(x + y) + b(x + y)
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Notice the repeated bracket",
        body: "Both parts now contain the same bracket, x + y.",
        math: [
          <MathLine key="shared">
            a(x + y) + b(x + y)
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Factor the repeated bracket",
        body: "The repeated bracket becomes one factor. The outside terms become the other factor.",
        math: [
          <MathLine key="finish">
            ax + ay + bx + by = (a + b)(x + y)
          </MathLine>
        ]
      }
    ]
  },
  "completing-square": {
    title: "Worked Example",
    intro: "Solve 2x² - 6x - 10 = 0 by changing the quadratic into a perfect square.",
    sections: [
      {
        heading: "Step 1: Divide by the coefficient of x²",
        body: "Completing the square is easiest when the x² coefficient is 1. Divide every term by 2 first.",
        math: [
          <MathLine key="start">
            2x<sup>2</sup> - 6x - 10 = 0
          </MathLine>,
          <MathLine key="divided">
            x<sup>2</sup> - 3x - 5 = 0
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Move the constant",
        body: "Keep the x terms on the left, and move the number term to the right side.",
        math: [
          <MathLine key="move">
            x<sup>2</sup> - 3x = 5
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Add the square of half the x coefficient",
        body: (
          <>
            Half of -3 is -<Fraction numerator="3" denominator="2" inline />. Square it, then add that same value to both sides so the equation stays balanced.
          </>
        ),
        math: [
          <MathLine key="add-half">
            x<sup>2</sup> - 3x + (-<Fraction numerator="3" denominator="2" />)<sup>2</sup> = 5 + (-<Fraction numerator="3" denominator="2" />)<sup>2</sup>
          </MathLine>,
          <MathLine key="square-half">
            x<sup>2</sup> - 3x + <Fraction numerator="9" denominator="4" /> = 5 + <Fraction numerator="9" denominator="4" />
          </MathLine>,
          <MathLine key="combine">
            x<sup>2</sup> - 3x + <Fraction numerator="9" denominator="4" /> = <Fraction numerator="29" denominator="4" />
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Factor the left side",
        body: "The left side is now a perfect square trinomial, so it folds into one squared bracket.",
        math: [
          <MathLine key="factor-left">
            (x - <Fraction numerator="3" denominator="2" />)<sup>2</sup> = <Fraction numerator="29" denominator="4" />
          </MathLine>
        ]
      },
      {
        heading: "Step 5: Use the square root property",
        body: "If a square equals a number, the bracket equals the positive or negative square root of that number.",
        math: [
          <MathLine key="sqrt">
            x - <Fraction numerator="3" denominator="2" /> = ±<Root><Fraction numerator="29" denominator="4" /></Root>
          </MathLine>,
          <MathLine key="sqrt-simplified">
            x - <Fraction numerator="3" denominator="2" /> = ±<Fraction numerator={<Root>29</Root>} denominator="2" />
          </MathLine>
        ]
      },
      {
        heading: "Step 6: Solve for x",
        body: (
          <>
            Add <Fraction numerator="3" denominator="2" inline /> to both sides. The two signs give the two solutions of the quadratic.
          </>
        ),
        math: [
          <MathLine key="solution">
            x = <Fraction numerator="3" denominator="2" /> ± <Fraction numerator={<Root>29</Root>} denominator="2" />
          </MathLine>,
          <MathLine key="combined-solution">
            x = <Fraction numerator={<>3 ± <Root>29</Root></>} denominator="2" />
          </MathLine>
        ]
      }
    ]
  },
  "quadratic-identities": {
    title: "Formula Walkthrough",
    intro: "These identities work because each factor form expands back into the expression on the left.",
    sections: [
      {
        heading: "Step 1: Difference of two squares",
        body: "When the middle terms cancel, only the two squares remain.",
        math: [
          <MathLine key="diff-expand">
            (x + a)(x - a) = x<sup>2</sup> - ax + ax - a<sup>2</sup>
          </MathLine>,
          <MathLine key="diff-finish">
            x<sup>2</sup> - a<sup>2</sup> = (x + a)(x - a)
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Perfect square with plus",
        body: "The bracket is repeated, so the middle term appears twice.",
        math: [
          <MathLine key="plus-expand">
            (x + a)<sup>2</sup> = (x + a)(x + a)
          </MathLine>,
          <MathLine key="plus-finish">
            x<sup>2</sup> + 2ax + a<sup>2</sup> = (x + a)<sup>2</sup>
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Perfect square with minus",
        body: "The same repeated-bracket idea works with x - a, but the middle term is negative.",
        math: [
          <MathLine key="minus-expand">
            (x - a)<sup>2</sup> = (x - a)(x - a)
          </MathLine>,
          <MathLine key="minus-finish">
            x<sup>2</sup> - 2ax + a<sup>2</sup> = (x - a)<sup>2</sup>
          </MathLine>
        ]
      },
      {
        heading: "Step 4: General two-number trinomial",
        body: "The x coefficient comes from adding the two bracket numbers. The constant comes from multiplying them.",
        math: [
          <MathLine key="trinomial-expand">
            (x + a)(x + b) = x<sup>2</sup> + ax + bx + ab
          </MathLine>,
          <MathLine key="trinomial-finish">
            x<sup>2</sup> + (a + b)x + ab = (x + a)(x + b)
          </MathLine>
        ]
      }
    ]
  },
  "cubic-identities": {
    title: "Formula Walkthrough",
    intro: "Cubic identities are patterns for expanding or factorising expressions involving cubes.",
    sections: [
      {
        heading: "Step 1: Perfect cube with plus",
        body: "Expanding (x + a) three times creates the coefficient pattern 1, 3, 3, 1.",
        math: [
          <MathLine key="plus-cube">
            (x + a)<sup>3</sup> = x<sup>3</sup> + 3ax<sup>2</sup> + 3a<sup>2</sup>x + a<sup>3</sup>
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Perfect cube with minus",
        body: "When the bracket is x - a, the signs alternate.",
        math: [
          <MathLine key="minus-cube">
            (x - a)<sup>3</sup> = x<sup>3</sup> - 3ax<sup>2</sup> + 3a<sup>2</sup>x - a<sup>3</sup>
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Sum of cubes",
        body: "A sum of cubes has a simple factor x + a and a quadratic factor with alternating signs.",
        math: [
          <MathLine key="sum-cubes">
            x<sup>3</sup> + a<sup>3</sup> = (x + a)(x<sup>2</sup> - ax + a<sup>2</sup>)
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Difference of cubes",
        body: "A difference of cubes has x - a as the simple factor, and the quadratic factor uses all plus signs.",
        math: [
          <MathLine key="difference-cubes">
            x<sup>3</sup> - a<sup>3</sup> = (x - a)(x<sup>2</sup> + ax + a<sup>2</sup>)
          </MathLine>
        ]
      }
    ]
  },
  "power-identities": {
    title: "Formula Walkthrough",
    intro: "Power identities generalise the same factor patterns to larger exponents.",
    sections: [
      {
        heading: "Step 1: Even powers are a difference of squares",
        body: "If both powers are even, rewrite them as squares and then factor.",
        math: [
          <MathLine key="even-rewrite">
            x<sup>2n</sup> - a<sup>2n</sup> = (x<sup>n</sup>)<sup>2</sup> - (a<sup>n</sup>)<sup>2</sup>
          </MathLine>,
          <MathLine key="even-factor">
            x<sup>2n</sup> - a<sup>2n</sup> = (x<sup>n</sup> - a<sup>n</sup>)(x<sup>n</sup> + a<sup>n</sup>)
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Odd power difference",
        body: "For odd n, x - a is a factor. The remaining factor descends in powers of x and rises in powers of a.",
        math: [
          <MathLine key="odd-minus">
            x<sup>n</sup> - a<sup>n</sup> = (x - a)(x<sup>n - 1</sup> + ax<sup>n - 2</sup> + ... + a<sup>n - 1</sup>)
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Odd power sum",
        body: "For odd n, x + a is a factor. The remaining factor alternates signs.",
        math: [
          <MathLine key="odd-plus">
            x<sup>n</sup> + a<sup>n</sup> = (x + a)(x<sup>n - 1</sup> - ax<sup>n - 2</sup> + a<sup>2</sup>x<sup>n - 3</sup> - ... + a<sup>n - 1</sup>)
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Use the pattern carefully",
        body: "First decide whether the expression is a sum or difference, then check whether the power is even or odd.",
        math: [
          <MathLine key="choose-difference">
            difference: x - a
          </MathLine>,
          <MathLine key="choose-sum">
            sum with odd n: x + a
          </MathLine>
        ]
      }
    ]
  },
  radians: {
    title: "Worked Example",
    intro: "Sometimes the question gives the arc length and radius, then asks for the angle. First find the minor angle, then decide whether the question wants the minor angle or the major angle.",
    sections: [
      {
        heading: "Step 1: Identify the radius and the requested angle",
        body: "The radius is 3.5 cm and the minor arc length is 0.7π. The question asks for the major angle y, so we first find the minor angle x.",
        visual: <AngleFromArcFigure />,
        math: [
          <MathLine key="angle-radius">
            r <MathOp>=</MathOp> 3.5 cm
          </MathLine>,
          <MathLine key="angle-arc">
            minor arc length <MathOp>=</MathOp> 0.7π
          </MathLine>,
          <MathLine key="angle-relation">
            y <MathOp>=</MathOp> 360° <MathOp>-</MathOp> x
          </MathLine>
        ]
      },
      {
        heading: "Step 2: Substitute into the arc length formula",
        body: "When the angle is in degrees, use the angle as a fraction of the full circumference.",
        math: [
          <MathLine key="arc-formula">
            arc length <MathOp>=</MathOp> 2πr <MathOp>×</MathOp> <Fraction numerator="θ" denominator="360" />
          </MathLine>,
          <MathLine key="arc-substitute">
            0.7π <MathOp>=</MathOp> 2π(3.5) <MathOp>×</MathOp> <Fraction numerator="x" denominator="360" />
          </MathLine>,
          <MathLine key="arc-simplify">
            0.7π <MathOp>=</MathOp> 7π <MathOp>×</MathOp> <Fraction numerator="x" denominator="360" />
          </MathLine>
        ]
      },
      {
        heading: "Step 3: Solve for the minor angle",
        body: "Cancel π from both sides, then undo the multiplication by 7 over 360.",
        math: [
          <MathLine key="solve-cancel">
            0.7 <MathOp>=</MathOp> <Fraction numerator="7x" denominator="360" />
          </MathLine>,
          <MathLine key="solve-multiply">
            0.7 <MathOp>×</MathOp> 360 <MathOp>=</MathOp> 7x
          </MathLine>,
          <MathLine key="solve-divide">
            x <MathOp>=</MathOp> <Fraction numerator="0.7 × 360" denominator="7" /> <MathOp>=</MathOp> 36°
          </MathLine>
        ]
      },
      {
        heading: "Step 4: Convert to the major angle",
        body: "The question asks for the major angle y, so subtract the minor angle from a full turn.",
        math: [
          <MathLine key="major-relation">
            y <MathOp>=</MathOp> 360° <MathOp>-</MathOp> x
          </MathLine>,
          <MathLine key="major-answer">
            y <MathOp>=</MathOp> 360° <MathOp>-</MathOp> 36° <MathOp>=</MathOp> 324°
          </MathLine>
        ]
      }
    ]
  }
};

function TeachLensLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      className={compact ? "teachLensLogo compact" : "teachLensBrandImage"}
      src={compact ? "/brand/teachlens-icon.png" : "/brand/teachlens-horizontal-logo.png"}
      alt=""
      aria-hidden="true"
    />
  );
}

export default function Home({ initialLessonId }: { initialLessonId?: string } = {}) {
  const initialLessonIndex = Math.max(
    0,
    lessons.findIndex((item) => item.id === initialLessonId)
  );
  const [lessonIndex, setLessonIndex] = useState(initialLessonIndex);
  const [step, setStep] = useState(0);
  const lesson = lessons[lessonIndex];
  const activeStep = lesson.steps[step];
  const writeup = lessonWriteups[lesson.id];
  const footerLinks = lessonCategories.flatMap((category) => {
    const firstLesson = lessons.find((item) => item.category === category);
    return firstLesson ? [firstLesson] : [];
  });
  const progress = useMemo(() => `${((step + 1) / lesson.steps.length) * 100}%`, [lesson.steps.length, step]);

  function chooseLesson(index: number) {
    setLessonIndex(index);
    setStep(0);
  }

  return (
    <main className="shell">
      <header className="siteHeader">
        <a className="brandLockup" href="/" aria-label="TeachLens home">
          <TeachLensLogo />
          <div className="siteBrand">
            <h1 className="srOnly">TeachLens</h1>
          </div>
        </a>
        <nav className="topNav" aria-label="Choose lesson">
          {lessonCategories.map((category) => {
            return (
              <details key={category} className={lesson.category === category ? "topNavGroup active" : "topNavGroup"}>
                <summary>{category}</summary>
                <div className="topNavMenu">
                  {lessons.map((item, index) =>
                    item.category === category ? (
                      <a
                        href={`/lessons/${item.id}`}
                        key={item.id}
                        className={index === lessonIndex ? "topLessonItem active" : "topLessonItem"}
                        onClick={() => chooseLesson(index)}
                      >
                        {item.title}
                      </a>
                    ) : null
                  )}
                </div>
              </details>
            );
          })}
        </nav>
        <details className="mobileLessonBrowser">
          <summary>Browse lessons</summary>
          <div className="mobileLessonPanel">
            {lessonCategories.map((category) => (
              <details key={category} className="mobileLessonCategory" open={lesson.category === category}>
                <summary>{category}</summary>
                <div className="mobileLessonList">
                  {lessons.map((item, index) =>
                    item.category === category ? (
                      <a
                        href={`/lessons/${item.id}`}
                        key={item.id}
                        className={index === lessonIndex ? "topLessonItem active" : "topLessonItem"}
                        onClick={() => chooseLesson(index)}
                      >
                        {item.title}
                      </a>
                    ) : null
                  )}
                </div>
              </details>
            ))}
          </div>
        </details>
      </header>

      <section className="lesson">
        <aside className="sidebar" aria-label="Lesson navigation">
          <div className="sidebarHeader">
            <p className="eyebrow">{lesson.category}</p>
            <h2>Lessons</h2>
            <p>{lesson.title}</p>
          </div>

          <div className="mobilePickers">
            <label>
              <span>Step</span>
              <select value={step} onChange={(event) => setStep(Number(event.target.value))}>
                {lesson.steps.map((item, index) => (
                  <option key={item.label} value={index}>
                    {index + 1}. {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="sidebarMenu desktopMenu">
            <nav className="pageBookmarks" aria-label="Page sections">
              <h3>On this page</h3>
              <a href="#lesson-stage">Animated model</a>
              <a href="#lesson-step">Step explanation</a>
              {writeup && <a href="#lesson-notes">{writeup.title}</a>}
            </nav>

            <nav className="stepList" aria-label="Lesson steps">
              <h3>Steps</h3>
              <div className="stepScroller">
                {lesson.steps.map((item, index) => (
                  <button
                    key={item.label}
                    className={index === step ? "stepButton active" : "stepButton"}
                    onClick={() => setStep(index)}
                    aria-current={index === step ? "step" : undefined}
                  >
                    <span>{index + 1}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        <section className="stagePanel" id="lesson-stage" aria-live="polite">
          <div className="stageHeader">
            <div className="lessonHero">
              <p className="lessonEyebrow">{lesson.eyebrow}</p>
              <h2>{activeStep.title}</h2>
              <div className="formula formulaBanner">{activeStep.formula}</div>
            </div>
          </div>

          {lesson.id === "triangle-area" && <TriangleDiagram step={step} />}
          {lesson.id === "sas-area" && <SasDiagram step={step} />}
          {lesson.id === "trig-ratios" && <TrigDiagram step={step} />}
          {lesson.id === "sine-derived" && <SineDerivedDiagram step={step} />}
          {lesson.id === "pi-derived" && <PiDerivedDiagram step={step} />}
          {lesson.id === "circle-area" && <CircleAreaDiagram step={step} />}
          {lesson.id === "sector-area" && <SectorDiagram mode="area" step={step} />}
          {lesson.id === "sector-perimeter" && <SectorDiagram mode="perimeter" step={step} />}
          {lesson.id === "radians" && <SectorDiagram mode="radian" step={step} />}
          {lesson.id === "equation-balance" && <AlgebraDiagram kind="balance" step={step} />}
          {lesson.id === "simultaneous-equations" && <SimultaneousDiagram step={step} />}
          {lesson.id === "matrix-operations" && <MatrixDiagram step={step} />}
          {lesson.id === "distributive-property" && <AlgebraDiagram kind="distribute" step={step} />}
          {lesson.id === "factoring-quadratics" && <AlgebraDiagram kind="factor" step={step} />}
          {lesson.id === "common-factor" && <FactorMethodDiagram method="common" step={step} />}
          {lesson.id === "difference-of-squares" && <FactorMethodDiagram method="squares" step={step} />}
          {lesson.id === "factor-by-grouping" && <FactorMethodDiagram method="grouping" step={step} />}
          {lesson.id === "completing-square" && <FactorMethodDiagram method="complete" step={step} />}
          {lesson.id === "quadratic-identities" && <FormulaIdentityDiagram family="quadratic" step={step} />}
          {lesson.id === "cubic-identities" && <FormulaIdentityDiagram family="cubic" step={step} />}
          {lesson.id === "power-identities" && <FormulaIdentityDiagram family="power" step={step} />}

          <div className="lessonText" id="lesson-step">
            <div className="progressTrack" aria-hidden="true">
              <div style={{ width: progress }} />
            </div>
            <p>{activeStep.text}</p>
            <div className="controls">
              <button onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
                Back
              </button>
              <button
                onClick={() => setStep((value) => Math.min(lesson.steps.length - 1, value + 1))}
                disabled={step === lesson.steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          {writeup && <LessonWriteupPanel writeup={writeup} />}
        </section>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand">
          <div className="footerLogoRow">
            <TeachLensLogo compact />
            <div>
              <p className="eyebrow">TeachLens</p>
              <p>Animated explanations and worked examples for visual study.</p>
            </div>
          </div>
        </div>
        <nav className="footerLinks" aria-label="Footer categories">
          {footerLinks.map((item) => (
            <a key={item.category} href={`/lessons/${item.id}`}>
              {item.category}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}

function LessonWriteupPanel({ writeup }: { writeup: LessonWriteup }) {
  return (
    <section className="lessonWriteup" id="lesson-notes" aria-labelledby="lesson-writeup-title">
      <div className="lessonWriteupHeader">
        <p className="eyebrow">Detailed notes</p>
        <h3 id="lesson-writeup-title">{writeup.title}</h3>
        <p>{writeup.intro}</p>
      </div>

      <div className="writeupGrid">
        {writeup.sections.map((section) => (
          <article className="writeupStep" key={section.heading}>
            <h4>{section.heading}</h4>
            <p>{section.body}</p>
            {section.visual && <div className="writeupVisual">{section.visual}</div>}
            <div className="writeupMathList">
              {section.math.map((line, index) => (
                <div className="writeupMath" key={index}>
                  {line}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MathLine({ children }: { children: ReactNode }) {
  return <span className="mathLine">{renderMathTokens(children)}</span>;
}

function MathVar({ children }: { children: ReactNode }) {
  return <span className="mathVar">{children}</span>;
}

function MathOp({ children }: { children: ReactNode }) {
  return <span className="mathOp">{children}</span>;
}

function Matrix({ rows }: { rows: ReactNode[][] }) {
  const columnCount = rows[0]?.length ?? 0;

  return (
    <span className="matrixNotation">
      <span className="matrixBracket">[</span>
      <span className="matrixGrid" style={{ gridTemplateColumns: `repeat(${columnCount}, auto)` }}>
        {rows.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <span key={`${rowIndex}-${columnIndex}`}>{renderMathTokens(cell)}</span>
          ))
        )}
      </span>
      <span className="matrixBracket">]</span>
    </span>
  );
}

function renderMathTokens(node: ReactNode): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return tokenizeMathText(String(node));
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => <span key={index}>{renderMathTokens(child)}</span>);
  }

  if (isValidElement(node)) {
    return node;
  }

  return node;
}

function tokenizeMathText(text: string): ReactNode[] {
  const pieces = text.split(/([+\-=×±÷])/g);

  return pieces.flatMap((piece, pieceIndex) => {
    if (!piece) {
      return [];
    }

    if (/^[+\-=×±÷]$/.test(piece)) {
      return [<MathOp key={`op-${pieceIndex}`}>{piece}</MathOp>];
    }

    return piece.split(/([A-Za-z]+)/g).flatMap<ReactNode>((part, partIndex) => {
      if (!part) {
        return [];
      }

      if (/^[abnxy]+$/.test(part)) {
        return part.split("").map((letter, letterIndex) => (
          <MathVar key={`var-${pieceIndex}-${partIndex}-${letterIndex}`}>{letter}</MathVar>
        ));
      }

      return [part];
    });
  });
}

function Fraction({
  numerator,
  denominator,
  inline = false
}: {
  numerator: ReactNode;
  denominator: ReactNode;
  inline?: boolean;
}) {
  return (
    <span className={inline ? "mathFraction inlineFraction" : "mathFraction"}>
      <span>{numerator}</span>
      <span>{denominator}</span>
    </span>
  );
}

function Root({ children }: { children: ReactNode }) {
  return (
    <span className="mathRoot">
      <span>{children}</span>
    </span>
  );
}

function AngleFromArcFigure() {
  return (
    <svg className="arcAngleFigure" viewBox="0 0 520 300" role="img" aria-label="Circle showing a minor arc and a major central angle">
      <rect x="0" y="0" width="520" height="300" rx="10" />
      <g transform="translate(250 148)">
        <circle className="arcFigureCircle" cx="0" cy="0" r="96" />
        <path className="arcFigureSector" d="M0 0 L34 -90 A96 96 0 0 1 83 -48 Z" />
        <path className="arcFigureMinor" d="M34 -90 A96 96 0 0 1 83 -48" />
        <path className="arcFigureMajor" d="M83 -48 A96 96 0 1 1 34 -90" />
        <line className="arcFigureRadius" x1="0" y1="0" x2="34" y2="-90" />
        <line className="arcFigureRadius" x1="0" y1="0" x2="83" y2="-48" />
        <circle className="arcFigurePoint" cx="0" cy="0" r="5" />
        <circle className="arcFigurePoint" cx="34" cy="-90" r="5" />
        <circle className="arcFigurePoint" cx="83" cy="-48" r="5" />
        <path className="arcFigureAngle" d="M25 -8 A27 27 0 0 0 12 -25" />
        <text className="arcFigureLabel" x="64" y="-4">3.5 cm</text>
        <text className="arcFigureLabel majorLabel" x="-72" y="40">y</text>
        <text className="arcFigureLabel minorLabel" x="60" y="-96">minor arc = 0.7π</text>
      </g>
    </svg>
  );
}

function TriangleDiagram({ step }: { step: number }) {
  return (
    <div className="diagram" data-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated triangle area explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <g className="parallelogramGuide">
          <path d="M190 315 L500 315 L610 115 L300 115 Z" />
          <text x="378" y="100">two triangles = base x height</text>
        </g>

        <g className="mainTriangle">
          <polygon points="190,315 500,315 300,115" />
        </g>
        <g className="copyTriangle">
          <polygon points="500,315 610,115 300,115" />
        </g>

        <line className="baseLine" x1="190" y1="315" x2="500" y2="315" />
        <line className="heightLine" x1="300" y1="315" x2="300" y2="115" />
        <path className="rightAngle" d="M300 292 L323 292 L323 315" />

        <text className="baseLabel" x="330" y="356">
          base
        </text>
        <text className="heightLabel" x="244" y="220">
          height
        </text>
        <text className="halfLabel" x="345" y="226">
          1 triangle = half
        </text>
      </svg>
    </div>
  );
}

function SasDiagram({ step }: { step: number }) {
  return (
    <div className="diagram sasDiagram" data-sas-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated SAS triangle area formula explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <polygon className="sasTriangle" points="150,320 600,320 380,90" />

        <line className="side sideA" x1="600" y1="320" x2="380" y2="90" />
        <line className="side sideB" x1="150" y1="320" x2="380" y2="90" />
        <line className="side sideC" x1="150" y1="320" x2="600" y2="320" />

        <g className="heightFromC heightGuide">
          <line x1="380" y1="90" x2="380" y2="320" />
          <path d="M380 296 L404 296 L404 320" />
          <text x="396" y="205">height</text>
        </g>

        <g className="heightFromB heightGuide">
          <line x1="600" y1="320" x2="265" y2="205" />
          <path d="M283 211 L275 234 L257 228" />
          <text x="415" y="245">height</text>
        </g>

        <g className="heightFromA heightGuide">
          <line x1="150" y1="320" x2="486" y2="210" />
          <path d="M467 216 L474 239 L493 233" />
          <text x="242" y="252">height</text>
        </g>

        <path className="angleArc angleC" d="M342 128 Q380 164 419 131" />
        <path className="angleArc angleA" d="M204 320 Q205 269 241 232" />
        <path className="angleArc angleB" d="M548 320 Q544 272 510 235" />

        <text className="vertexLabel" x="131" y="351">A</text>
        <text className="vertexLabel" x="604" y="351">B</text>
        <text className="vertexLabel" x="379" y="72">C</text>

        <text className="sideLabel sideLabelA" x="515" y="185">a</text>
        <text className="sideLabel sideLabelB" x="252" y="184">b</text>
        <text className="sideLabel sideLabelC" x="367" y="354">c</text>

        <g className="sasFormulaCard">
          <text x="38" y="48">Area = 1/2 x base x height</text>
          <text className="formulaLine formulaC" x="38" y="82">base b, height a sin(C)</text>
          <text className="formulaLine formulaA" x="38" y="82">base c, height b sin(A)</text>
          <text className="formulaLine formulaB" x="38" y="82">base a, height c sin(B)</text>
          <text className="formulaLine formulaAll" x="38" y="82">choose any included angle</text>
        </g>
      </svg>
    </div>
  );
}

function TrigDiagram({ step }: { step: number }) {
  return (
    <div className="diagram trigDiagram" data-trig-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated sine cosine tangent explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <polygon className="trigTriangle" points="155,320 585,320 585,110" />

        <line className="trigSide trigAdjacent" x1="155" y1="320" x2="585" y2="320" />
        <line className="trigSide trigOpposite" x1="585" y1="320" x2="585" y2="110" />
        <line className="trigSide trigHypotenuse" x1="155" y1="320" x2="585" y2="110" />

        <path className="trigRightAngle" d="M555 320 L555 290 L585 290" />
        <path className="thetaArc" d="M226 320 A71 71 0 0 0 219 289" />
        <text className="thetaLabel" x="235" y="306">theta</text>

        <text className="trigSideLabel adjacentLabel" x="337" y="356">adjacent</text>
        <text className="trigSideLabel oppositeLabel" x="604" y="224">opposite</text>
        <text className="trigSideLabel hypotenuseLabel" x="337" y="188">hypotenuse</text>

        <g className="ratioCard">
          <text className="ratioTitle" x="38" y="50">SOH CAH TOA</text>
          <text className="ratioLine ratioSin" x="38" y="86">sin = opposite / hypotenuse</text>
          <text className="ratioLine ratioCos" x="38" y="86">cos = adjacent / hypotenuse</text>
          <text className="ratioLine ratioTan" x="38" y="86">tan = opposite / adjacent</text>
          <text className="ratioLine ratioAll" x="38" y="86">choose theta, then name the sides</text>
        </g>
      </svg>
    </div>
  );
}

function SineDerivedDiagram({ step }: { step: number }) {
  return (
    <div className="diagram sineDerivedDiagram" data-sine-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated derivation of sine from the unit circle">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <line className="axisLine" x1="105" y1="230" x2="445" y2="230" />
        <line className="axisLine" x1="275" y1="60" x2="275" y2="400" />
        <circle className="unitCircle" cx="275" cy="230" r="140" />

        <path className="radianArc" d="M415 230 A140 140 0 0 0 351 112" />
        <path className="degreeArc" d="M415 230 A140 140 0 0 0 414.98 227.56" />
        <line className="radiusLine" x1="275" y1="230" x2="351" y2="112" />
        <line className="sineHeight" x1="351" y1="230" x2="351" y2="112" />
        <line className="cosBase" x1="275" y1="230" x2="351" y2="230" />
        <circle className="circlePoint" cx="351" cy="112" r="8" />

        <path className="sineRightAngle" d="M351 209 L372 209 L372 230" />
        <text className="unitCircleLabel" x="301" y="154">radius 1</text>
        <text className="unitCircleLabel sineYLabel" x="365" y="176">y = sin(theta)</text>
        <text className="unitCircleLabel" x="295" y="256">x = cos(theta)</text>
        <text className="unitCircleLabel thetaUnitLabel" x="386" y="205">1 radian</text>
        <text className="unitCircleLabel degreeUnitLabel" x="402" y="221">1 degree</text>

        <g className="sineValueCard">
          <text x="486" y="90">Point on unit circle</text>
          <text className="sineValueLine sineIntro" x="486" y="130">(x, y) = (cos(theta), sin(theta))</text>
          <text className="sineValueLine sineHeightText" x="486" y="130">sine is the vertical coordinate</text>
          <text className="sineValueLine sineRadianText" x="486" y="130">sin(1) = sin(1 radian)</text>
          <text className="sineValueLine sineDegreeText" x="486" y="130">sin(1 degree) uses a tiny angle</text>
          <text className="sineAnswerLine sineRadianAnswer" x="486" y="170">~= 0.84147</text>
          <text className="sineAnswerLine sineDegreeAnswer" x="486" y="170">~= 0.01745</text>
        </g>
      </svg>
    </div>
  );
}

function PiDerivedDiagram({ step }: { step: number }) {
  return (
    <div className="diagram piDiagram" data-pi-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated derivation of pi from circumference and diameter">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <circle className="piCircle" cx="245" cy="215" r="120" />
        <polygon className="piPolygon polygonHex" points="365,215 305,318.9 185,318.9 125,215 185,111.1 305,111.1" />
        <polygon className="piPolygon polygonDodec" points="365,215 348.9,275 305,318.9 245,335 185,318.9 141.1,275 125,215 141.1,155 185,111.1 245,95 305,111.1 348.9,155" />

        <line className="diameterLine" x1="125" y1="215" x2="365" y2="215" />
        <circle className="piCenter" cx="245" cy="215" r="5" />
        <text className="piLabel diameterLabel" x="218" y="202">d</text>

        <circle className="circumferenceTrace" cx="245" cy="215" r="120" />

        <g className="unwrappedLine">
          <line x1="448" y1="300" x2="705" y2="300" />
          <path d="M448 285 L448 315" />
          <path d="M530 285 L530 315" />
          <path d="M612 285 L612 315" />
          <path d="M705 285 L705 315" />
          <text x="456" y="276">1d</text>
          <text x="538" y="276">2d</text>
          <text x="620" y="276">3d</text>
          <text x="674" y="276">+ a bit</text>
        </g>

        <g className="piCard">
          <text x="455" y="88">Circle perimeter</text>
          <text className="piCardLine piMeasureText" x="455" y="126">measure across: diameter</text>
          <text className="piCardLine piUnwrapText" x="455" y="126">rim unwraps to about 3.14 d</text>
          <text className="piCardLine piRatioText" x="455" y="126">same ratio for every circle</text>
          <text className="piCardLine piPolygonText" x="455" y="126">many straight sides approach the rim</text>
          <text className="piCardLine piFormulaText" x="455" y="126">circumference = pi x diameter</text>
          <text className="piAnswerLine" x="455" y="170">pi = C / d</text>
        </g>
      </svg>
    </div>
  );
}

function CircleAreaDiagram({ step }: { step: number }) {
  return (
    <div className="diagram circleAreaDiagram" data-circle-area-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated derivation of circle area from wedges">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <g className="circleAreaCircle">
          <circle cx="210" cy="215" r="112" />
          <line x1="210" y1="215" x2="322" y2="215" />
          <line className="sliceLine" x1="210" y1="215" x2="289.2" y2="135.8" />
          <line className="sliceLine" x1="210" y1="215" x2="210" y2="103" />
          <line className="sliceLine" x1="210" y1="215" x2="130.8" y2="135.8" />
          <line className="sliceLine" x1="210" y1="215" x2="98" y2="215" />
          <line className="sliceLine" x1="210" y1="215" x2="130.8" y2="294.2" />
          <line className="sliceLine" x1="210" y1="215" x2="210" y2="327" />
          <line className="sliceLine" x1="210" y1="215" x2="289.2" y2="294.2" />
          <text x="250" y="202">r</text>
        </g>

        <g className="wedgeRow">
          <path className="wedge wedgeUp" d="M410 280 L448 150 Q486 180 486 280 Z" />
          <path className="wedge wedgeDown" d="M448 150 L486 280 Q524 250 524 150 Z" />
          <path className="wedge wedgeUp" d="M486 280 L524 150 Q562 180 562 280 Z" />
          <path className="wedge wedgeDown" d="M524 150 L562 280 Q600 250 600 150 Z" />
          <path className="wedge wedgeUp" d="M562 280 L600 150 Q638 180 638 280 Z" />
          <path className="wedge wedgeDown" d="M600 150 L638 280 Q676 250 676 150 Z" />
        </g>

        <g className="areaRectangleGuide">
          <path d="M410 150 L676 150 L676 280 L410 280 Z" />
          <line x1="410" y1="300" x2="676" y2="300" />
          <line x1="696" y1="150" x2="696" y2="280" />
          <text x="515" y="333">pi r</text>
          <text x="710" y="222">r</text>
        </g>

        <g className="circleAreaCard">
          <text x="42" y="54">Area stays the same</text>
          <text className="circleAreaLine areaCircleText" x="42" y="92">circle edge = 2 pi r</text>
          <text className="circleAreaLine areaSlicesText" x="42" y="92">many wedges, each height r</text>
          <text className="circleAreaLine areaRearrangeText" x="42" y="92">alternate wedges into a strip</text>
          <text className="circleAreaLine areaHalfText" x="42" y="92">base is half the rim: pi r</text>
          <text className="circleAreaLine areaFormulaText" x="42" y="92">area = base x height</text>
          <text className="circleAreaAnswer" x="42" y="132">A = pi r<tspan className="super">2</tspan></text>
        </g>
      </svg>
    </div>
  );
}

function SectorDiagram({ mode, step }: { mode: "area" | "perimeter" | "radian"; step: number }) {
  return (
    <div className="diagram sectorDiagram" data-sector-mode={mode} data-sector-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated sector and radian explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <circle className="sectorCircle" cx="285" cy="230" r="132" />
        <path className="sectorFill" d="M285 230 L417 230 A132 132 0 0 0 351 116 Z" />
        <line className="sectorRadius radiusOne" x1="285" y1="230" x2="417" y2="230" />
        <line className="sectorRadius radiusTwo" x1="285" y1="230" x2="351" y2="116" />
        <path className="sectorArc" d="M417 230 A132 132 0 0 0 351 116" />
        <path className="sectorAngle" d="M337 230 A52 52 0 0 0 311 185" />

        <text className="sectorLabel radiusLabelOne" x="342" y="254">r</text>
        <text className="sectorLabel radiusLabelTwo" x="327" y="166">r</text>
        <text className="sectorLabel thetaLabelSector" x="336" y="204">theta</text>
        <text className="sectorLabel arcLabel" x="400" y="170">arc</text>

        <g className="sectorCard">
          <text x="476" y="86">Sector facts</text>
          <text className="sectorLine sectorAreaIntro" x="476" y="128">slice = angle fraction of circle</text>
          <text className="sectorLine sectorAreaFormula" x="476" y="128">A = (theta / 360) pi r<tspan className="super">2</tspan></text>
          <text className="sectorLine sectorAreaRadians" x="476" y="128">A = 1/2 r<tspan className="super">2</tspan> theta</text>
          <text className="sectorLine sectorPerimeterIntro" x="476" y="128">perimeter = r + arc + r</text>
          <text className="sectorLine sectorPerimeterArc" x="476" y="128">arc = r theta</text>
          <text className="sectorLine sectorPerimeterFormula" x="476" y="128">P = 2r + r theta</text>
          <text className="sectorLine radianIntro" x="476" y="128">theta = arc / r</text>
          <text className="sectorLine radianOne" x="476" y="128">1 radian when arc = r</text>
          <text className="sectorLine radianFull" x="476" y="128">full turn = 2 pi radians</text>
          <text className="sectorLine radianBridge" x="476" y="128">arc = r theta</text>
          <text className="sectorAnswer" x="476" y="182">theta in radians</text>
        </g>
      </svg>
    </div>
  );
}

function SimultaneousDiagram({ step }: { step: number }) {
  const callouts = [
    ["System of equations", "find one pair that works twice"],
    ["Substitution", "replace y, solve one equation"],
    ["Elimination", "subtract equations, remove y"],
    ["Graphing", "solution is the crossing point"],
    ["Check", "put x and y back into both"]
  ];
  const [heading, detail] = callouts[step] ?? callouts[0];

  return (
    <div className="diagram simultaneousDiagram" data-sim-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated simultaneous equations explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <g className="simGraph">
          <line className="simAxis" x1="86" y1="324" x2="372" y2="324" />
          <line className="simAxis" x1="132" y1="360" x2="132" y2="76" />
          <path className="simLine lineOne" d="M96 314 L346 98" />
          <path className="simLine lineTwo" d="M90 116 L350 324" />
          <circle className="simPoint" cx="224" cy="204" r="9" />
          <path className="simGuide" d="M224 204 L224 324 M132 204 L224 204" />
          <text className="simAxisLabel" x="352" y="349">x</text>
          <text className="simAxisLabel" x="104" y="88">y</text>
          <text className="simLineLabel labelOne" x="255" y="118">y = x + 1</text>
          <text className="simLineLabel labelTwo" x="252" y="310">y = -x + 5</text>
          <text className="simPointLabel" x="238" y="196">(2, 3)</text>
        </g>

        <g className="simMethodCard">
          <rect x="438" y="74" width="254" height="258" rx="8" />
          <text className="simCardTitle" x="565" y="122">{heading}</text>
          <text className="simCardDetail" x="565" y="158">{detail}</text>
          <text className="simEquation eqOne" x="565" y="212">2x + y = 11</text>
          <text className="simEquation eqTwo" x="565" y="252">x + y = 7</text>
          <text className="simEquation eqAnswer" x="565" y="296">x = 4, y = 3</text>
        </g>
      </svg>
    </div>
  );
}

function MatrixDiagram({ step }: { step: number }) {
  const headings = [
    ["Matrix size", "rows first, columns second"],
    ["Addition", "add entries in the same position"],
    ["Subtraction", "subtract entries in the same position"],
    ["Multiplication", "row times column makes one entry"],
    ["No direct division", "multiply by an inverse instead"],
    ["Size rules", "check whether the operation is allowed"]
  ];
  const [heading, detail] = headings[step] ?? headings[0];

  return (
    <div className="diagram matrixDiagram" data-matrix-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated matrix operations explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <g className="matrixTitleCard">
          <rect x="70" y="38" width="620" height="70" rx="10" />
          <text className="matrixTitle" x="380" y="72">{heading}</text>
          <text className="matrixSubtitle" x="380" y="96">{detail}</text>
        </g>

        {step === 0 && (
          <>
            <g className="matrixBoard largeMatrix" transform="translate(274 142)">
              <rect width="212" height="178" rx="10" />
              <text className="matrixCellSvg" x="64" y="72">1</text>
              <text className="matrixCellSvg" x="148" y="72">2</text>
              <text className="matrixCellSvg" x="64" y="128">3</text>
              <text className="matrixCellSvg" x="148" y="128">4</text>
              <path className="matrixBracketSvg left" d="M42 34 H24 V146 H42" />
              <path className="matrixBracketSvg right" d="M170 34 H188 V146 H170" />
            </g>
            <path className="matrixRowGuide" d="M246 212 H514" />
            <path className="matrixColumnGuide" d="M380 122 V346" />
            <text className="matrixGuideText" x="176" y="218">2 rows</text>
            <text className="matrixGuideText" x="394" y="356">2 columns</text>
          </>
        )}

        {step === 1 && (
          <>
            <MatrixSvgCard x={72} y={150} rows={[["1", "2"], ["3", "4"]]} highlight={[0, 0]} />
            <text className="matrixOperatorSvg" x="235" y="245">+</text>
            <MatrixSvgCard x={274} y={150} rows={[["5", "6"], ["7", "8"]]} highlight={[0, 0]} />
            <text className="matrixOperatorSvg" x="438" y="245">=</text>
            <MatrixSvgCard x={480} y={150} rows={[["6", "8"], ["10", "12"]]} highlight={[0, 0]} result />
            <text className="matrixNoteSvg" x="380" y="346">1 + 5 = 6, then repeat for each matching position</text>
          </>
        )}

        {step === 2 && (
          <>
            <MatrixSvgCard x={72} y={150} rows={[["5", "6"], ["7", "8"]]} highlight={[1, 1]} />
            <text className="matrixOperatorSvg" x="235" y="245">-</text>
            <MatrixSvgCard x={274} y={150} rows={[["1", "2"], ["3", "4"]]} highlight={[1, 1]} />
            <text className="matrixOperatorSvg" x="438" y="245">=</text>
            <MatrixSvgCard x={480} y={150} rows={[["4", "4"], ["4", "4"]]} highlight={[1, 1]} result />
            <text className="matrixNoteSvg" x="380" y="346">8 - 4 = 4, with the same-position rule</text>
          </>
        )}

        {step === 3 && (
          <>
            <MatrixSvgCard x={66} y={142} rows={[["1", "2"], ["3", "4"]]} rowHighlight={0} />
            <text className="matrixOperatorSvg" x="226" y="238">×</text>
            <MatrixSvgCard x={270} y={142} rows={[["2", "0"], ["1", "2"]]} columnHighlight={0} />
            <text className="matrixOperatorSvg" x="430" y="238">=</text>
            <MatrixSvgCard x={474} y={142} rows={[["4", "4"], ["10", "8"]]} highlight={[0, 0]} result />
            <g className="matrixWorkCard">
              <rect x="202" y="318" width="356" height="46" rx="8" />
              <text x="380" y="348">1 × 2 + 2 × 1 = 4</text>
            </g>
          </>
        )}

        {step === 4 && (
          <>
            <g className="matrixInverseCard">
              <rect x="112" y="154" width="536" height="164" rx="12" />
              <text className="matrixInverseMain" x="380" y="214">A ÷ B is not direct division</text>
              <text className="matrixInverseArrow" x="380" y="252">A ÷ B means A × B⁻¹</text>
              <text className="matrixInverseSub" x="380" y="286">only when B has an inverse</text>
            </g>
          </>
        )}

        {step === 5 && (
          <>
            <g className="matrixRuleCard" transform="translate(70 150)">
              <rect width="190" height="132" rx="10" />
              <text x="95" y="44">Add / subtract</text>
              <text className="matrixRuleText" x="95" y="82">same size</text>
              <text className="matrixRuleText" x="95" y="108">2 × 2 with 2 × 2</text>
            </g>
            <g className="matrixRuleCard" transform="translate(285 150)">
              <rect width="190" height="132" rx="10" />
              <text x="95" y="44">Multiply</text>
              <text className="matrixRuleText" x="95" y="82">inside sizes match</text>
              <text className="matrixRuleText" x="95" y="108">2 × 3 with 3 × 2</text>
            </g>
            <g className="matrixRuleCard" transform="translate(500 150)">
              <rect width="190" height="132" rx="10" />
              <text x="95" y="44">Inverse</text>
              <text className="matrixRuleText" x="95" y="82">square matrix</text>
              <text className="matrixRuleText" x="95" y="108">determinant not 0</text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}

function MatrixSvgCard({
  x,
  y,
  rows,
  highlight,
  rowHighlight,
  columnHighlight,
  result = false
}: {
  x: number;
  y: number;
  rows: string[][];
  highlight?: [number, number];
  rowHighlight?: number;
  columnHighlight?: number;
  result?: boolean;
}) {
  return (
    <g className={result ? "matrixBoard matrixResultBoard" : "matrixBoard"} transform={`translate(${x} ${y})`}>
      <rect width="142" height="150" rx="10" />
      {rowHighlight !== undefined && <rect className="matrixBand" x="30" y={38 + rowHighlight * 44} width="82" height="34" rx="6" />}
      {columnHighlight !== undefined && <rect className="matrixBand" x={38 + columnHighlight * 42} y="32" width="32" height="86" rx="6" />}
      {highlight && <rect className="matrixCellHighlight" x={35 + highlight[1] * 42} y={38 + highlight[0] * 44} width="38" height="34" rx="6" />}
      <path className="matrixBracketSvg left" d="M28 28 H14 V122 H28" />
      <path className="matrixBracketSvg right" d="M114 28 H128 V122 H114" />
      {rows.map((row, rowIndex) =>
        row.map((value, columnIndex) => (
          <text className="matrixCellSvg" key={`${rowIndex}-${columnIndex}`} x={52 + columnIndex * 42} y={62 + rowIndex * 44}>
            {value}
          </text>
        ))
      )}
    </g>
  );
}

function AlgebraDiagram({ kind, step }: { kind: "balance" | "distribute" | "factor"; step: number }) {
  return (
    <div className="diagram algebraDiagram" data-algebra-kind={kind} data-algebra-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated algebra explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        {kind === "balance" && (
          <>
            <line className="scaleBeam" x1="150" y1="235" x2="610" y2="235" />
            <line className="scalePost" x1="380" y1="235" x2="380" y2="345" />
            <path className="scaleBase" d="M320 345 L440 345" />
            <g className="scalePan leftPan">
              <path d="M160 255 L330 255 L300 310 L190 310 Z" />
              <text x="245" y="289">x + 3</text>
            </g>
            <g className="scalePan rightPan">
              <path d="M430 255 L600 255 L570 310 L460 310 Z" />
              <text x="515" y="289">7</text>
            </g>
            <text className="algebraEquation mainEquation" x="380" y="76">x + 3 = 7</text>
            <text className="algebraEquation removeEquation" x="380" y="118">subtract 3 from both sides</text>
            <text className="algebraEquation answerEquation" x="380" y="164">x = 4</text>
          </>
        )}

        {kind === "distribute" && (
          <>
            <rect className="groupBox" x="210" y="145" width="300" height="140" rx="8" />
            <text className="outsideFactor" x="145" y="226">3</text>
            <text className="insideTerm" x="275" y="226">x</text>
            <text className="insideTerm" x="410" y="226">2</text>
            <path className="distributeArrow arrowOne" d="M178 205 C235 155 275 155 300 198" />
            <path className="distributeArrow arrowTwo" d="M178 230 C270 310 410 310 432 235" />
            <text className="algebraEquation mainEquation" x="380" y="92">3(x + 2)</text>
            <text className="algebraEquation removeEquation" x="380" y="332">3 × x + 3 × 2</text>
            <text className="algebraEquation answerEquation" x="380" y="372">3x + 6</text>
          </>
        )}

        {kind === "factor" && (
          <>
            <rect className="tile tileSquare" x="150" y="150" width="118" height="118" rx="6" />
            <rect className="tile tileX tileXOne" x="282" y="150" width="72" height="118" rx="6" />
            <rect className="tile tileX tileXTwo" x="368" y="150" width="72" height="118" rx="6" />
            <rect className="tile tileUnit" x="454" y="150" width="44" height="44" rx="6" />
            <rect className="tile tileUnit" x="506" y="150" width="44" height="44" rx="6" />
            <rect className="tile tileUnit" x="558" y="150" width="44" height="44" rx="6" />
            <rect className="tile tileUnit" x="454" y="204" width="44" height="44" rx="6" />
            <rect className="tile tileUnit" x="506" y="204" width="44" height="44" rx="6" />
            <rect className="tile tileUnit" x="558" y="204" width="44" height="44" rx="6" />
            <text className="tileLabel" x="185" y="218">x<tspan className="super">2</tspan></text>
            <text className="tileLabel" x="303" y="218">2x</text>
            <text className="tileLabel" x="389" y="218">3x</text>
            <text className="algebraEquation mainEquation" x="380" y="92">x<tspan className="super">2</tspan> + 5x + 6</text>
            <text className="algebraEquation removeEquation" x="380" y="322">2 and 3 make 5 and 6</text>
            <text className="algebraEquation answerEquation" x="380" y="365">(x + 2)(x + 3)</text>
          </>
        )}
      </svg>
    </div>
  );
}

function FactorMethodDiagram({
  method,
  step
}: {
  method: "common" | "squares" | "grouping" | "complete";
  step: number;
}) {
  return (
    <div className="diagram factorMethodDiagram" data-factor-method={method} data-factor-step={step}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated factorising method explanation">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        {method === "common" && (
          <>
            <text className="factorTitle" x="380" y="72">6x + 9</text>
            <rect className="factorBlock sharedFactor" x="150" y="145" width="120" height="86" rx="8" />
            <rect className="factorBlock termBlock" x="292" y="145" width="120" height="86" rx="8" />
            <rect className="factorBlock sharedFactor" x="450" y="145" width="120" height="86" rx="8" />
            <text className="factorText" x="210" y="199">3 × 2x</text>
            <text className="factorText" x="352" y="199">+</text>
            <text className="factorText" x="510" y="199">3 × 3</text>
            <path className="factorArrow" d="M210 250 C250 310 460 310 510 250" />
            <text className="factorResult" x="380" y="342">3(2x + 3)</text>
          </>
        )}

        {method === "squares" && (
          <>
            <text className="factorTitle" x="380" y="72">x<tspan className="super">2</tspan> - 9</text>
            <rect className="squareTile bigSquare" x="160" y="135" width="130" height="130" rx="8" />
            <rect className="squareTile smallSquare" x="470" y="165" width="84" height="84" rx="8" />
            <text className="factorText" x="225" y="208">x<tspan className="super">2</tspan></text>
            <text className="factorText minusSign" x="380" y="210">-</text>
            <text className="factorText" x="512" y="218">3<tspan className="super">2</tspan></text>
            <text className="factorHint" x="380" y="312">A<tspan className="super">2</tspan> - B<tspan className="super">2</tspan> = (A - B)(A + B)</text>
            <text className="factorResult" x="380" y="360">(x - 3)(x + 3)</text>
          </>
        )}

        {method === "grouping" && (
          <>
            <text className="factorTitle" x="380" y="72">ax + ay + bx + by</text>
            <rect className="groupPair firstPair" x="120" y="145" width="240" height="112" rx="8" />
            <rect className="groupPair secondPair" x="400" y="145" width="240" height="112" rx="8" />
            <text className="factorText" x="240" y="208">a(x + y)</text>
            <text className="factorText" x="520" y="208">b(x + y)</text>
            <text className="factorHint" x="380" y="306">shared bracket: (x + y)</text>
            <text className="factorResult" x="380" y="358">(a + b)(x + y)</text>
          </>
        )}

        {method === "complete" && (
          <>
            <text className="factorTitle" x="380" y="72">x<tspan className="super">2</tspan> + 6x + 5</text>
            <rect className="completeSquareBox" x="180" y="130" width="160" height="160" rx="8" />
            <rect className="completeStrip stripRight" x="340" y="130" width="54" height="160" rx="8" />
            <rect className="completeStrip stripBottom" x="180" y="290" width="160" height="54" rx="8" />
            <rect className="missingCorner" x="340" y="290" width="54" height="54" rx="8" />
            <text className="factorText" x="260" y="215">x<tspan className="super">2</tspan></text>
            <text className="factorHint" x="500" y="172">half of 6 is 3</text>
            <text className="factorHint" x="500" y="220">(x + 3)<tspan className="super">2</tspan></text>
            <text className="factorHint" x="500" y="268">subtract 4</text>
            <text className="factorResult" x="380" y="374">(x + 3)<tspan className="super">2</tspan> - 4</text>
          </>
        )}
      </svg>
    </div>
  );
}

function FormulaIdentityDiagram({
  family,
  step
}: {
  family: "quadratic" | "cubic" | "power";
  step: number;
}) {
  const formulas = {
    quadratic: [
      ["x² - a²", "(x + a)(x - a)"],
      ["x² + 2ax + a²", "(x + a)²"],
      ["x² - 2ax + a²", "(x - a)²"],
      ["x² + (a + b)x + ab", "(x + a)(x + b)"]
    ],
    cubic: [
      ["x³ + 3ax² + 3a²x + a³", "(x + a)³"],
      ["x³ - 3ax² + 3a²x - a³", "(x - a)³"],
      ["x³ + a³", "(x + a)(x² - ax + a²)"],
      ["x³ - a³", "(x - a)(x² + ax + a²)"]
    ],
    power: [
      ["x²ⁿ - a²ⁿ", "(xⁿ - aⁿ)(xⁿ + aⁿ)"],
      ["xⁿ - aⁿ", "(x - a)(xⁿ⁻¹ + axⁿ⁻² + ... + aⁿ⁻¹)"],
      ["xⁿ + aⁿ", "(x + a)(xⁿ⁻¹ - axⁿ⁻² + a²xⁿ⁻³ - ... + aⁿ⁻¹)"]
    ]
  }[family];
  const [left, right] = formulas[step] ?? formulas[0];

  return (
    <div className="diagram identityDiagram" data-identity-family={family}>
      <svg viewBox="0 0 760 430" role="img" aria-label="Animated factoring formula identity">
        <DiagramDefs />
        <rect width="760" height="430" rx="6" fill="#f6f1e8" />
        <rect width="760" height="430" rx="6" fill="url(#grid)" opacity="0.75" />

        <g className="identityBoard">
          <rect x="98" y="98" width="564" height="230" rx="8" />
          <text className="identityExpression" x="380" y="176">{left}</text>
          <text className="identityEquals" x="380" y="226">=</text>
          <text className="identityFactored" x="380" y="282">{right}</text>
        </g>

        <g className="identityCue">
          <text x="380" y="365">recognise the pattern, then replace it with the factor form</text>
        </g>
      </svg>
    </div>
  );
}

function DiagramDefs() {
  return (
    <defs>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#d8e1d3" strokeWidth="1" />
      </pattern>
      <linearGradient id="triangleFill" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#0b74e8" />
        <stop offset="100%" stopColor="#69b9ff" />
      </linearGradient>
      <linearGradient id="copyFill" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#69b9ff" />
        <stop offset="100%" stopColor="#1d8aff" />
      </linearGradient>
    </defs>
  );
}
