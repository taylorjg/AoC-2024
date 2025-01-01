const makeKeyDefault = ({ row, col }) => `${row}:${col}`;

// const unmakeKeyDefault = (key) => {
//   const [row, col] = key.split(":").Map(Number);
//   return { row, col };
// };

const reconstructPath = (cameFromMap, currentNode, makeKey) => {
  const path = [currentNode];
  let currentKey = makeKey(currentNode);

  for (; ;) {
    const node = cameFromMap.get(currentKey);
    if (!node) break;
    path.push(node);
    currentKey = makeKey(node);
  }

  return path.reverse();
};

export const A_Star = (
  start,
  goal,
  d,
  h,
  findNeighbours,
  makeKey = makeKeyDefault,
  // unmakeKey = unmakeKeyDefault,
) => {
  const startKey = makeKey(start);
  const goalKey = makeKey(goal);
  const openSet = [{ node: start, key: startKey }];
  const cameFromMap = new Map();
  const gScoreMap = new Map([[makeKey(start), 0]]);
  const fScoreMap = new Map([[makeKey(start), h(start)]]);

  const chooseBestItemFromOpenSet = () => {
    const kvps = openSet.map((item) => [item, fScoreMap.get(item.key)]);
    kvps.sort((a, b) => a[1] - b[1]);
    return kvps[0][0];
  };

  const ensureInOpenSet = (node, key) => {
    const index = openSet.findIndex((item) => item.key === key);
    if (index < 0) openSet.push({ node, key });
  };

  const removeFromOpenSet = (itemToRemove) => {
    const index = openSet.findIndex((item) => item.key === itemToRemove.key);
    if (index >= 0) openSet.splice(index, 1);
  };

  const lookupGScore = (key) => gScoreMap.get(key) ?? Number.MAX_SAFE_INTEGER;

  for (; ;) {
    if (openSet.length === 0) break;
    const currentItem = chooseBestItemFromOpenSet();
    if (currentItem.key === goalKey) {
      return reconstructPath(cameFromMap, currentItem.node, makeKey);
    }

    removeFromOpenSet(currentItem);

    const neighbours = findNeighbours(currentItem.node);
    for (const neighbour of neighbours) {
      const neighbourKey = makeKey(neighbour);
      const distance = d(currentItem.node, neighbour);
      const tentativeGScore = lookupGScore(currentItem.key) + distance;
      const gScoreNeighbour = lookupGScore(neighbourKey);
      if (tentativeGScore < gScoreNeighbour) {
        cameFromMap.set(neighbourKey, currentItem.node);
        gScoreMap.set(neighbourKey, tentativeGScore);
        fScoreMap.set(neighbourKey, tentativeGScore + h(neighbour));
        ensureInOpenSet(neighbour, neighbourKey);
      }
    }
  }

  // Goal not achieved
  return;
};
