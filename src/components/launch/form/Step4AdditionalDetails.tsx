'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import type { LaunchTag, TokenFormData } from '@/types/launchForm';

interface Step4AdditionalDetailsProps {
  formData: TokenFormData;
  tags: readonly LaunchTag[];
  onInputChange: (field: keyof TokenFormData, value: TokenFormData[keyof TokenFormData]) => void;
}

const Step4AdditionalDetails: React.FC<Step4AdditionalDetailsProps> = ({ formData, tags, onInputChange }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Step 4 - Additional Details</h2>
      <p className="text-gray-400 mb-6">Add any additional information about your token.</p>

      <div className="w-full">
        <label className="block text-sm font-medium text-white mb-2">Tag</label>
        <Select value={formData.tag} onValueChange={(value) => onInputChange('tag', value)}>
          <SelectTrigger className="w-full bg-[#0D1117] border border-stroke-3 text-white">
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent className="bg-[#0D1117] border border-stroke-3">
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag} className="text-white hover:bg-background-5">
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
          placeholder="Describe your token project..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default Step4AdditionalDetails;

