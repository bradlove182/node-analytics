import Input from "./pin-input.svelte";
import Root from "./pin.svelte";

export type FormInputEvent<T extends Event = Event> = T & {
    currentTarget: EventTarget & HTMLInputElement;
};
export type PinInputEvents = {
    blur: FormInputEvent<FocusEvent>;
    change: FormInputEvent<Event>;
    focus: FormInputEvent<FocusEvent>;
    keydown: FormInputEvent<KeyboardEvent>;
    paste: FormInputEvent<ClipboardEvent>;
    input: FormInputEvent<InputEvent>;
};

export {
    Input,
    //
    Root as Pin,
    Input as PinInput,
    Root,
};
