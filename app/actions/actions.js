import alt from '../alt';

class AltActions {
  setProfile(prof) {
    return prof;
  }

  getProfile() {
    return true;
  }
}

module.exports = alt.createActions(AltActions);