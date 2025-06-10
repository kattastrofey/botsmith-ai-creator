// UIComponents.tsx - Reusable UI components for the application
// Migrated from aab project

import React, { useState } from 'react';

// Multiple Selection Component
export const MultipleSelector = ({ options, onSelect, buttonText }: {
  options: string[];
  onSelect: (selected: string[]) => void;
  buttonText: string;
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(item => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="mt-2">
      <div className="mb-2 text-sm text-gray-600">Select all that apply:</div>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`option-${index}`}
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
              className="mr-2"
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSelect(selected)}
        className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
      >
        {buttonText}
      </button>
    </div>
  );
};

// Chat Message Bubble
export const ChatBubble = ({ message, isUser }: {
  message: string;
  isUser: boolean;
}) => {
  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-indigo-500 text-white rounded-lg py-2 px-4 max-w-md">
          {message}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex mb-4">
        <div className="bg-white rounded-lg py-3 px-4 max-w-md shadow-sm">
          {message}
        </div>
      </div>
    );
  }
};

// Option Button for chat suggestions
export const OptionButton = ({ option, onClick }: {
  option: string;
  onClick: (option: string) => void;
}) => {
  return (
    <button 
      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm m-1"
      onClick={() => onClick(option)}
    >
      {option}
    </button>
  );
};

// Section Card for the preview page
export const SectionCard = ({ title, icon, children }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-50 p-3 border-b">
        <h3 className="font-medium flex items-center">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// TabButton for tabbed interfaces
export const TabButton = ({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      className={`px-4 py-3 font-medium ${active ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ActionButton for primary actions
export const ActionButton = ({ primary, icon, onClick, children }: {
  primary?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  if (primary) {
    return (
      <button 
        onClick={onClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md flex items-center"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  } else {
    return (
      <button 
        onClick={onClick}
        className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 px-6 rounded-md flex items-center"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
};

// IconButton for smaller icon actions
export const IconButton = ({ icon, onClick, tooltip }: {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
}) => {
  return (
    <button 
      onClick={onClick} 
      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
      title={tooltip}
    >
      {icon}
    </button>
  );
};

