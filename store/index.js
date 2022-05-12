export const state = () => ({
  organization: null,
  members: [],
  projects: [],
  repositories: [],
  clientPrepared: false,
  activeRoom: null,
  activeRoomMessages: [],
  chatList: [],
  replyToMessage: null,
  editMessage: null,
  isFirstMatrixUse: true,
  showVideoCall: false,
})

export const getters = {
  members(state) {
    return state.organization?.members
  },
}

export const mutations = {
  setOrganization(state, organization) {
    state.organization = organization
  },
  setMembers(state, members) {
    state.members = members
  },
  setProjects(state, projects) {
    state.projects = projects
  },
  setRepositories(state, repositories) {
    state.repositories = repositories
  },
  // MATRIX
  setActiveRoom(state, roomId) {
    state.activeRoom = roomId
  },
  setMessages(state, messages) {
    state.activeRoomMessages = messages
  },
  setClientPrepared(state, clientState) {
    state.clientPrepared = clientState
  },
  setFirstMatrixUse(state, isFirstUse) {
    state.isFirstMatrixUse = isFirstUse
  },
  startVideoCall(state) {
    state.showVideoCall = true
  },
  stopVideoCall(state) {
    state.showVideoCall = false
  },
  setReplyToMessage(state, message) {
    state.replyToMessage = message
  },
  setEditMessage(state, message) {
    state.editMessage = message
  },
}

export const actions = {
  async loadProjects({ commit, state, auth }) {
    const organizationId = state.organization.id
    if (organizationId) {
      const projects = await this.$axios.$get(
        `/api/organizations/${organizationId}/projects`
      )
      commit('setProjects', projects)
    }
  },
  async loadOrganization({ commit, auth }) {
    const organization = await this.$axios.$get('/api/organizations/')
    commit('setOrganization', organization)
  },
  setActiveOrganization({ commit, dispatch, auth }, organization) {
    dispatch('loadProjects')
    commit('setOrganization', organization)
  },
  activateDefaultOrganization({ commit, dispatch, rootState }) {
    if (rootState.auth.user.organizations.length > 0) {
      const defaultOrganization = rootState.auth.user.organizations[0] // procurar
      commit('setOrganization', defaultOrganization)
      dispatch('loadProjects')
    }
  },
  setReplyToMessage({ commit }, message) {
    commit('setReplyToMessage', message)
  },
  setEditMessage({ commit }, message) {
    commit('setEditMessage', message)
  },
}
