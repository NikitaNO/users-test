export const makeReducer =
  (reducersMap, initialState) =>
    (state = initialState, action) =>
      reducersMap[action.type] != null
        ? reducersMap[action.type](state, action)
        : state;

export const removeByKey =
  (keyToRemote, obj) =>
    Object.entries(obj)
      .reduce((acc, [key, value]) => {
        if (key !== String(keyToRemote)) {
          acc[key] = value;
        }

        return acc;
      }, {});

export const roundTo2Points = n =>
  Math.round(n * 100) / 100;
