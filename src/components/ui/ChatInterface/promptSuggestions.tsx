import React from 'react';
import { Card, CardContent } from '../card';

interface PromptSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => onSelect(suggestion)}>
            <CardContent className="flex items-center w-full text-center">
              <p>{suggestion}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;