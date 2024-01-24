import React from 'react';
// import { Story, Meta } from '@storybook/react/types-6-0';
import Button, { ButtonProps } from './Button';
// import '../../styles/index.scss';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Primary = {
  args: {
    primary: true,
    btnType: 'primary',
    children: '确定',
    size: 'medium',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    label: 'Button2',
    size: 'large',
    btnType: 'secondary',
  },
};
