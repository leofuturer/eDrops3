const closestParent = (child, className) => {
  if (!child || child == document) {
    return null;
  }
  if (child.classList.contains(className)) {
    return child;
  }
  return closestParent(child.parentNode, className);
};

/**
  * The method is used to display error messages adding <p>
  * behind the input
  */
const addError = (messages, error) => {
  const block = document.createElement('p');
  block.classList.add('help-block');
  block.classList.add('error');
  block.innerHTML = error;
  messages.appendChild(block);
};

const showErrorsOrSuccessForInput = (input, errors) => {
  const formGroup = closestParent(input.parentNode, 'form-group');
  const messages = formGroup.querySelector('.messages');

  // remove old messages and reset the classes
  formGroup.classList.remove('has-error');
  formGroup.classList.remove('has-success');
  // and remove any old messages
  formGroup.querySelectorAll('.help-block.error, .text-muted, .text-success').forEach((ele, index) => {
    ele.remove();
  });

  if (errors) {
    // we first mark the group has having errors
    formGroup.classList.add('has-error');
    // then we append all the errors
    errors.forEach((err, index) => {
      addError(messages, err); // Attention: we must use the _this instead of this!!!
    });
  } else {
    // otherwise we simply mark it as success
    const messages2 = formGroup.querySelector('.messages');
    formGroup.classList.add('has-success');
    const successInfo = document.createElement('p');
    successInfo.classList.add('text-success');
    successInfo.innerHTML = 'Looks good!';
    messages2.appendChild(successInfo);
  }
};

export { closestParent, showErrorsOrSuccessForInput };
