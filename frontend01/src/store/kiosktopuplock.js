topup// store/modules/kiosktopupLock.js
const state = {
  isLocked: false,
  lockedBy: null
};

const mutations = {
  lockRoute(state, username) {
    state.isLocked = true;
    state.lockedBy = username;
  },
  unlockRoute(state) {
    state.isLocked = false;
    state.lockedBy = null;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
