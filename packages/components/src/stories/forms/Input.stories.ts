import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Input } from '../../components/forms/Input';

const meta = {
  component: Input,
  args: {
    onClick: fn()
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    required: true,
    disabled: false,
    name: "email",
    placeholder: "Email"
  }
}

export const Password: Story = {
  args: {
    required: true,
    disabled: false,
    name: "password",
    type: "password",
    placeholder: "Password"
  }
}

