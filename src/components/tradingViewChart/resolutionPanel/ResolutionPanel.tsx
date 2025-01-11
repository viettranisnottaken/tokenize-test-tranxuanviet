import React, { forwardRef, useState } from 'react';

import { EInterval } from '../../../models/interval.enum';
import PillBtn from '../../common/pillBtn/PillBtn';
import RoundBtn from '../../common/roundBtn/RoundBtn';
import { TResolution } from '../resolutionSection/ResolutionSection';
import './ResolutionPanel.scss';

type TResolutionPanelProps = {
  classNames?: string;
  selectedResolution: EInterval;
  pinnedResolutions: TResolution[];
  availableResolutions: TResolution[];
  onResolutionChange: (resolution: EInterval) => void;
  onMoveToPinned: (resolution: TResolution) => void;
  onMoveToAvailable: (resolution: TResolution) => void;
};

const ResolutionPanel: React.FC<TResolutionPanelProps> = React.memo(
  forwardRef(
    (
      {
        classNames,
        selectedResolution,
        pinnedResolutions,
        availableResolutions,
        onResolutionChange,
        onMoveToPinned,
        onMoveToAvailable,
      },
      ref
    ) => {
      const [isEditing, setIsEditing] = useState(false);

      const moveToPinned = (resolution: TResolution) => {
        onMoveToPinned(resolution);
      };

      const moveToAvailable = (resolution: TResolution) => {
        onMoveToAvailable(resolution);
      };

      return (
        <div ref={ref} className={'resolution-panel-host ' + (classNames ?? '')}>
          <div className="section-label">
            <span>Pinned</span>
            <PillBtn onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? 'Save' : 'Edit'}
            </PillBtn>
          </div>

          <div className="section-content mb-2">
            {pinnedResolutions.map((resolution) => (
              <div key={resolution.score} className="pill-btn-wrapper">
                <PillBtn
                  classNames={selectedResolution === resolution.value ? 'selected' : ''}
                  width={60}
                  onClick={() => onResolutionChange(resolution.value)}
                >
                  {resolution.label}
                </PillBtn>

                <RoundBtn
                  classNames={isEditing ? 'icon' : 'icon d-none'}
                  onClick={() => moveToAvailable(resolution)}
                >
                  -
                </RoundBtn>
              </div>
            ))}
          </div>

          <div className="section-label">
            <span>Available</span>
          </div>

          <div className="section-content">
            {availableResolutions.map((resolution) => (
              <div key={resolution.score} className="pill-btn-wrapper">
                <PillBtn
                  classNames={selectedResolution === resolution.value ? 'selected' : ''}
                  width={60}
                  onClick={() => onResolutionChange(resolution.value)}
                >
                  {resolution.label}
                </PillBtn>

                <RoundBtn
                  classNames={isEditing ? 'icon' : 'icon d-none'}
                  onClick={() => moveToPinned(resolution)}
                >
                  +
                </RoundBtn>
              </div>
            ))}
          </div>
        </div>
      );
    }
  )
);

export default ResolutionPanel;
