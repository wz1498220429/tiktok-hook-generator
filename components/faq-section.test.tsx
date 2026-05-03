import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqSection } from './faq-section';

describe('FaqSection', () => {
  it('renders key FAQ titles', () => {
    render(<FaqSection />);
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Why hooks matter')).toBeInTheDocument();
  });
});
