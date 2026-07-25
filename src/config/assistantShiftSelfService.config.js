const enabled = (value) => String(value).toLowerCase() === 'true';

export const assistantShiftSelfServiceConfig = Object.freeze({
  canSelfRegister: enabled(import.meta.env.VITE_ASSISTANT_SHIFT_SELF_REGISTER_ENABLED),
  canSelfCancel: enabled(import.meta.env.VITE_ASSISTANT_SHIFT_SELF_CANCEL_ENABLED),
  canSelfSwap: enabled(import.meta.env.VITE_ASSISTANT_SHIFT_SELF_SWAP_ENABLED),
  canSelfTransfer: enabled(import.meta.env.VITE_ASSISTANT_SHIFT_SELF_TRANSFER_ENABLED),
});

