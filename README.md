# TeachLens

A Next.js math learning portal with animated, visual explanations.

## Algebra Lessons

- Balancing equations
- Distributive property
- Factoring quadratics
- Common factor
- Difference of squares
- Factor by grouping
- Completing the square
- Quadratic factoring formulas
- Cubic factoring formulas
- nth-power factoring formulas
- Formulas:
  - `x + 3 = 7 -> x = 4`
  - `a(b + c) = a · b + a · c`
  - `x² + 5x + 6 = (x + 2)(x + 3)`
  - `6x + 9 = 3(2x + 3)`
  - `x² - 9 = (x - 3)(x + 3)`
  - `ax + ay + bx + by = (a + b)(x + y)`
  - `x² + 6x + 5 = (x + 3)² - 4`
  - `x² - a² = (x + a)(x - a)`
  - `x² + 2ax + a² = (x + a)²`
  - `x³ + a³ = (x + a)(x² - ax + a²)`
  - `x²ⁿ - a²ⁿ = (xⁿ - aⁿ)(xⁿ + aⁿ)`

## First Lesson

- Area of a triangle
- Step-by-step animated diagram
- Formula explanation: `A = 1/2 x base x height`
- Backend lesson metadata route at `/api/lessons`

## Added Lesson

- SAS triangle area formula
- Animated side, angle, and height highlights
- Equivalent formulas:
  - `Area = 1/2 ab x sin(C)`
  - `Area = 1/2 bc x sin(A)`
  - `Area = 1/2 ac x sin(B)`

## Trigonometry Lesson

- Explains `sin`, `cos`, and `tan`
- Highlights opposite, adjacent, and hypotenuse from a chosen angle
- Formulas:
  - `sin(theta) = opposite / hypotenuse`
  - `cos(theta) = adjacent / hypotenuse`
  - `tan(theta) = opposite / adjacent`

## Sine Derivation Lesson

- Explains sine from the unit circle
- Shows `sin(theta)` as the y-coordinate of a point on radius 1
- Clarifies:
  - `sin(1 radian) ~= 0.84147`
  - `sin(1 degree) ~= 0.01745`

## Pi Derivation Lesson

- Explains pi as the ratio between circumference and diameter
- Shows circumference as the perimeter of a circle
- Connects polygon perimeters to circle circumference
- Formula: `C = pi d = 2 pi r`

## Circle Area Lesson

- Derives circle area by slicing the circle into wedges
- Rearranges wedges into an almost-rectangle
- Shows base as half the circumference: `pi r`
- Formula: `A = pi r²`

## Sector And Radian Lessons

- Area of a sector
- Perimeter of a sector
- Radian measure from arc length
- Formulas:
  - `A = (theta / 360) pi r²`
  - `A = 1/2 r² theta`
  - `P = 2r + r theta`
  - `theta = arc / r`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```
