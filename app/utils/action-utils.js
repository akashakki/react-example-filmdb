// import {isFunction} from 'lodash';

export default {
  networkAction: async function(context, method, ...params) {
    const loginState = context.alt.getStore('login').getState();
    const token = loginState.user && loginState.user.token;
    if (params.length < 1) params.push({});
    if (token) params.push({'auth-token': token});
    const statusActions = context.alt.getActions('status');
    try {
      statusActions.started();
      const response = await method.apply(context, params);
      // const data = isFunction(response) ? response().data : response.data;
      context.dispatch(response().data);
      statusActions.done();
    } catch (err) {
      console.error(err);
      statusActions.failed({config: err.config, action: context.actionDetails});
    }
  }
};
