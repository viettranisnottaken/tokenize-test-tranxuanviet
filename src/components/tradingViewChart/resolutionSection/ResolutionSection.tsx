import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { EInterval } from '../../../models/interval.enum';
import PillBtn from '../../common/pillBtn/PillBtn';
import ResolutionPanel from '../resolutionPanel/ResolutionPanel';
import './ResolutionSection.scss';
import { throttle } from '../../../util/throttle';
import ArrowDown from '../../icons/ArrowDown';

type TResolutionSectionProps = {
  selectedResolution: EInterval;
  onResolutionChange: (resolution: EInterval) => void;
};

export type TResolution = {
  label: string;
  value: EInterval;
  score: number;
};

type TResolutionCollection = {
  [key in EInterval]?: TResolution;
};

const defaultPinnedResolutions: TResolutionCollection = {
  [EInterval.s1]: {
    label: '1s',
    value: EInterval.s1,
    score: 0,
  },
  [EInterval.m1]: {
    label: '1m',
    value: EInterval.m1,
    score: 1,
  },
  [EInterval.m3]: {
    label: '3m',
    value: EInterval.m3,
    score: 2,
  },
  [EInterval.m5]: {
    label: '5m',
    value: EInterval.m5,
    score: 3,
  },
  [EInterval.m15]: {
    label: '15m',
    value: EInterval.m15,
    score: 4,
  },
  [EInterval.m30]: {
    label: '30m',
    value: EInterval.m30,
    score: 5,
  },
};

const defaultAvailableResolutions: TResolutionCollection = {
  [EInterval.h1]: {
    label: '1h',
    value: EInterval.h1,
    score: 6,
  },
  [EInterval.h2]: {
    label: '2h',
    value: EInterval.h2,
    score: 7,
  },
  [EInterval.h4]: {
    label: '4h',
    value: EInterval.h4,
    score: 8,
  },
  [EInterval.h6]: {
    label: '6h',
    value: EInterval.h6,
    score: 9,
  },
  [EInterval.h8]: {
    label: '8h',
    value: EInterval.h8,
    score: 10,
  },
  [EInterval.h12]: {
    label: '12h',
    value: EInterval.h12,
    score: 11,
  },
  [EInterval.d1]: {
    label: '1d',
    value: EInterval.d1,
    score: 12,
  },
  [EInterval.d3]: {
    label: '3d',
    value: EInterval.d3,
    score: 13,
  },
  [EInterval.w1]: {
    label: '1w',
    value: EInterval.w1,
    score: 14,
  },
  [EInterval.M1]: {
    label: '1M',
    value: EInterval.M1,
    score: 15,
  },
};

const ResolutionSection: React.FC<TResolutionSectionProps> = React.memo(
  ({ selectedResolution: selectedResolutionProps, onResolutionChange }) => {
    const extraDisplayedContainerRef = useRef<HTMLDivElement>(null);
    const extraDisplayedPillRef = useRef<HTMLDivElement>(null);
    const pinnedListRef = useRef<HTMLDivElement>(null);
    const [isPillHiddenInScroll, setIsPillHiddenInScroll] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const [pinnedResolutionsStorage, setPinnedResolutionsStorage] =
      useLocalStorage<TResolutionCollection>('pinnedResolutions', null);
    const [availableResolutionsStorage, setAvailableResolutionsStorage] =
      useLocalStorage<TResolutionCollection>('availableResolutions', null);
    const [selectedResolutionStorage, setSelectedResolutionStorage] = useLocalStorage<EInterval>(
      'selectedResolution',
      null
    );
    const [pinnedResolutions, setPinnedResolutions] = useState(
      pinnedResolutionsStorage ?? defaultPinnedResolutions
    );
    const [availableResolutions, setAvailableResolutions] = useState(
      availableResolutionsStorage ?? defaultAvailableResolutions
    );

    const selectedResolution = useMemo(() => {
      return selectedResolutionStorage ?? selectedResolutionProps;
    }, [selectedResolutionProps, selectedResolutionStorage]);

    const selectedResolutionObj = useMemo(() => {
      return pinnedResolutions[selectedResolution] ?? availableResolutions[selectedResolution];
    }, [pinnedResolutions, availableResolutions, selectedResolution]);

    const pinnedResolutionsAsArray = useMemo(() => {
      return Object.values({ ...(pinnedResolutionsStorage ?? pinnedResolutions) }).sort(
        (a, b) => a.score - b.score
      );
    }, [pinnedResolutions, pinnedResolutionsStorage]);

    const availableResolutionsAsArray = useMemo(
      () =>
        Object.values({ ...(availableResolutionsStorage ?? availableResolutions) }).sort(
          (a, b) => a.score - b.score
        ),
      [availableResolutions, availableResolutionsStorage]
    );

    const isExtraPillHidden = useMemo(() => {
      return !(
        !pinnedResolutions[selectedResolution] ||
        (pinnedResolutions[selectedResolution] && isPillHiddenInScroll)
      );
    }, [pinnedResolutions, selectedResolution, isPillHiddenInScroll]);

    const moveToPinned = (resolution: TResolution) => {
      setPinnedResolutions((prev) => ({
        ...prev,
        [resolution.value]: resolution,
      }));
      setAvailableResolutions((prev) => {
        const newAvailableResolutions = { ...prev };
        delete newAvailableResolutions[resolution.value];
        return newAvailableResolutions;
      });
    };

    const moveToAvailable = (resolution: TResolution) => {
      setPinnedResolutions((prev) => {
        const newPinnedResolutions = { ...prev };
        delete newPinnedResolutions[resolution.value];
        return newPinnedResolutions;
      });
      setAvailableResolutions((prev) => ({
        ...prev,
        [resolution.value]: resolution,
      }));
    };

    const handleResolutionChange = (resolution: EInterval) => {
      onResolutionChange(resolution);
      setSelectedResolutionStorage(resolution);
    };

    useEffect(() => {
      setPinnedResolutionsStorage(pinnedResolutions);
      setAvailableResolutionsStorage(availableResolutions);
    }, [pinnedResolutions, availableResolutions]);

    useEffect(() => {
      const mouseoverHandler = () => {
        panelRef.current?.classList.add('d-flex');
        panelRef.current?.classList.remove('d-none');
      };

      const mouseLeaveHandler = () => {
        panelRef.current?.classList.add('d-none');
        panelRef.current?.classList.remove('d-flex');
      };

      if (panelRef.current && extraDisplayedContainerRef.current) {
        extraDisplayedContainerRef.current.addEventListener('mouseover', mouseoverHandler);
        panelRef.current.addEventListener('mouseover', mouseoverHandler);
        extraDisplayedContainerRef.current.addEventListener('mouseleave', mouseLeaveHandler);
        panelRef.current.addEventListener('mouseleave', mouseLeaveHandler);
      }

      return () => {
        console.log('clean up event listeners');
        
        if (panelRef.current && extraDisplayedContainerRef.current) {
          extraDisplayedContainerRef.current.removeEventListener('mouseover', mouseoverHandler);
          panelRef.current.removeEventListener('mouseover', mouseoverHandler);
          extraDisplayedContainerRef.current.removeEventListener('mouseleave', mouseLeaveHandler);
          panelRef.current.removeEventListener('mouseleave', mouseLeaveHandler);
        }
      };
    }, [panelRef.current, extraDisplayedContainerRef.current]);

    useEffect(() => {
      const resizeObserver = new ResizeObserver(
        throttle((entries: ResizeObserverEntry[]) => {
          const container = entries[0].target;

          if (pinnedListRef.current && extraDisplayedPillRef.current) {
            const containerLeft = container.getBoundingClientRect().left;
            const containerRight = container.getBoundingClientRect().right;
            const containerTop = container.getBoundingClientRect().top;
            const containerBottom = containerTop + container.clientHeight;

            const element = document.getElementById('selected-resolution') as Element;
            const elemLeft = element?.getBoundingClientRect().left;
            const elemRight = element?.getBoundingClientRect().right;
            const elemTop = element?.getBoundingClientRect().top;
            
            setIsPillHiddenInScroll(
              elemLeft >= containerRight ||
                elemRight <= containerLeft ||
                elemTop > containerBottom
            );
          }
        }, 200)
      );

      resizeObserver.observe(pinnedListRef.current as Element);

      return () => {
        console.log('disconnect resize observer');
        
        resizeObserver.disconnect();
      };
    }, [pinnedListRef.current, extraDisplayedPillRef.current, selectedResolution]);

    return (
      <div className="resolution-section">
        <div className="section-content">
          <div ref={pinnedListRef} className="pinned-list">
            {pinnedResolutionsAsArray.map((resolution) => (
              <div key={resolution.score} className="pill-btn-wrapper">
                <PillBtn
                  id={selectedResolution === resolution.value ? 'selected-resolution' : ''}
                  classNames={selectedResolution === resolution.value ? 'selected' : ''}
                  onClick={() => handleResolutionChange(resolution.value)}
                >
                  {resolution.label}
                </PillBtn>
              </div>
            ))}
          </div>

          <div ref={extraDisplayedContainerRef} className="d-flex gap-2 ml-4">
            <PillBtn
              ref={extraDisplayedPillRef}
              classNames={'selected ' + (isExtraPillHidden ? 'd-none' : '')}
            >
              {selectedResolutionObj?.label}
            </PillBtn>
            <PillBtn classNames='p-0' width={30} height={30}><ArrowDown /></PillBtn>
          </div>
        </div>

        <ResolutionPanel
          ref={panelRef}
          classNames="d-none"
          pinnedResolutions={pinnedResolutionsAsArray}
          availableResolutions={availableResolutionsAsArray}
          selectedResolution={selectedResolution}
          onResolutionChange={handleResolutionChange}
          onMoveToAvailable={moveToAvailable}
          onMoveToPinned={moveToPinned}
        />
      </div>
    );
  }
);

export default ResolutionSection;
