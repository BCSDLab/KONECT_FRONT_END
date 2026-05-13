export const isTextInputElement = (element: EventTarget | null): element is HTMLElement => {
  if (!(element instanceof HTMLElement)) return false;

  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element.isContentEditable;
};
