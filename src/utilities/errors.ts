export function isInteractionRequired(error: Error): boolean {
  if (!error.message || error.message.length <= 0) {
    return false;
  }

  return error.message.indexOf('consent_required') > -1 || error.message.indexOf('interaction_required') > -1 || error.message.indexOf('login_required') > -1;
}

export function normalizeError(error: string | Error): any {
  var normalizedError = {};
  if (typeof error === 'string') {
    var errParts = error.split('|');
    normalizedError = errParts.length > 1 ? { message: errParts[1], debug: errParts[0] } : { message: error };
  } else {
    normalizedError = {
      message: error.message,
      debug: JSON.stringify(error)
    };
  }
  return normalizedError;
}
