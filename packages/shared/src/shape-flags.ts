export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

//  << : 32 bit binary number  1
// 1 << 1: 1 * (2**1) = 2;    shift left : 10
// 10
// 1 << 2 : 1 * (2**2) = 4:  shift left: 100
// | : bitwise OR
// 100 | 010 = 110;  6

// 1. left operand convert to 32 binary number
// 2. all number shift left one position, redundant in the left will discard and zero are filled in on the right
// 3. convert binary number to decimal number
