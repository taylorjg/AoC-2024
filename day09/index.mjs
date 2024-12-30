import { readLines, range, isEven } from "../utils.mjs";

const FILE = "FILE";
const FREE = "FREE";

const makeRoot = () => {
  const root = {};
  root.next = root;
  root.prev = root;
  return root;
};

const insertNode = (after, node) => {
  const before = after.next;
  node.next = before;
  node.prev = after;
  after.next = node;
  before.prev = node;
  return node;
};

const removeNode = (node) => {
  const after = node.next;
  const before = node.prev;
  before.next = after;
  after.prev = before;
  node.next = null;
  node.prev = null;
  return node;
};

const appendNode = (root, node) => {
  return insertNode(root.prev, node);
};

const walkForward = (root, fn) => {
  let node = root.next;
  for (; ;) {
    if (node === root) break;
    fn(node)
    node = node.next;
  }
};

const findForward = (root, p, optionalStopNode) => {
  let node = root.next;
  for (; ;) {
    if (node === root) break;
    if (optionalStopNode && node === optionalStopNode) break;
    if (p(node)) return node;
    node = node.next;
  }
};

const findBackward = (root, p) => {
  let node = root.prev;
  for (; ;) {
    if (node === root) break;
    if (p(node)) return node;
    node = node.prev;
  }
};

const findFirstFree = (representation) => {
  return findForward(representation.root, (node) => node.type === FREE);
};

const buildRepresentation = (chars) => {
  let id = 0;
  const representation = {
    root: makeRoot(),
    firstFree: null,
  };

  chars.forEach((ch, index) => {
    const length = Number(ch);

    const node = isEven(index)
      ? { type: FILE, length, id: id++, }
      : { type: FREE, length };

    if (node.length > 0) {
      appendNode(representation.root, node);
    }
  });

  representation.firstFree = findFirstFree(representation);

  return representation;
};

const stillHasGaps = (representation) => {
  return representation.firstFree !== representation.root.prev;
};

const defragStep = (representation) => {
  const node = findBackward(representation.root, (node) => node.type === FILE);

  node.length--;
  if (node.length === 0) {
    removeNode(node);
  }

  const firstFree = representation.firstFree;
  const firstFreePrev = firstFree.prev;
  if (firstFreePrev.type === FILE && firstFreePrev.id === node.id) {
    firstFreePrev.length++;
  } else {
    const newNode = { type: FILE, length: 1, id: node.id };
    insertNode(firstFreePrev, newNode);
  }

  firstFree.length--;
  if (firstFree.length === 0) {
    removeNode(firstFree);
    representation.firstFree = findFirstFree(representation);
  }

  if (representation.root.prev.type === FREE) {
    representation.root.prev.length++;
  } else {
    appendNode(representation.root, { type: FREE, length: 1 });
  }
};

const defrag = (representation) => {
  for (; ;) {
    if (!stillHasGaps(representation)) break;
    defragStep(representation);
  }
};

const toString = (representation) => {
  let s = "";

  walkForward(representation.root, (node) => {
    const { type, length, id } = node;
    const ch = type === FILE ? String(id) : ".";
    s += ch.repeat(length);
  });

  return s;
};

const calculateChecksum = (representation) => {
  let index = 0;
  let checksum = 0;

  walkForward(representation.root, (node) => {
    if (node.type === FILE) {
      for (const _ of range(node.length)) {
        checksum += index * node.id;
        index++;
      }
    }

    if (node.type === FREE) {
      index += node.length;
    }
  });

  return checksum;
};

const part1 = async (filename, showStringRep = false) => {
  const [line] = await readLines(filename);
  const chars = Array.from(line);

  const representation = buildRepresentation(chars);
  showStringRep && console.log(toString(representation));

  defrag(representation);
  showStringRep && console.log(toString(representation));

  const checksum = calculateChecksum(representation);
  console.log(checksum);
};

const defrag2 = (representation) => {
  let currentId = findBackward(representation.root, (node) => node.type === FILE).id;

  for (; ;) {
    if (currentId < 0) break;
    const node = findBackward(representation.root, (node) => node.type === FILE && node.id === currentId);
    console.assert(node);
    currentId--;

    const destFreeBlock = findForward(representation.root, (n) => n.type === FREE && n.length >= node.length, node);
    if (!destFreeBlock) continue;

    const oldNext = node.next;
    const oldPrev = node.prev;

    if (oldPrev.type === FREE && oldNext.type === FREE) {
      oldPrev.length += node.length;
      oldPrev.length += oldNext.length;
      removeNode(oldNext);
    }

    if (oldPrev.type === FREE && oldNext.type !== FREE) {
      oldPrev.length += node.length;
    }

    if (oldPrev.type !== FREE && oldNext.type === FREE) {
      oldNext.length += node.length;
    }

    if (oldPrev.type !== FREE && oldNext.type !== FREE) {
      insertNode(oldPrev, { type: FREE, length: node.length });
    }

    removeNode(node);
    insertNode(destFreeBlock.prev, node);

    destFreeBlock.length -= node.length;
    if (destFreeBlock.length === 0) removeNode(destFreeBlock);
  }
};

const part2 = async (filename, showStringRep = false) => {
  const [line] = await readLines(filename);
  const chars = Array.from(line);

  const representation = buildRepresentation(chars);
  showStringRep && console.log(toString(representation));

  defrag2(representation);
  showStringRep && console.log(toString(representation));

  const checksum = calculateChecksum(representation);
  console.log(checksum);
};

const main = async () => {
  await part1("day09/example.txt", true);
  await part1("day09/input.txt");

  await part2("day09/example.txt", true);
  await part2("day09/input.txt");
};

main();
