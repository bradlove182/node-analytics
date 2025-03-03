import * as FormPrimitive from "formsnap"
import Button from "./FormButton.svelte"
import Description from "./FormDescription.svelte"
import ElementField from "./FormElementField.svelte"
import Field from "./FormField.svelte"
import FieldErrors from "./FormFieldErrors.svelte"
import Fieldset from "./FormFieldset.svelte"
import Label from "./FormLabel.svelte"
import Legend from "./FormLegend.svelte"

const Control = FormPrimitive.Control as typeof FormPrimitive.Control

export {
    Button,
    Control,
    Description,
    ElementField,
    Field,
    FieldErrors,
    Fieldset,
    Button as FormButton,
    Control as FormControl,
    Description as FormDescription,
    ElementField as FormElementField,
    //
    Field as FormField,
    FieldErrors as FormFieldErrors,
    Fieldset as FormFieldset,
    Label as FormLabel,
    Legend as FormLegend,
    Label,
    Legend,
}
