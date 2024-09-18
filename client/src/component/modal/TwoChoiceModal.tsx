import React, { useCallback } from 'react'
import ModalBackground from './ModalBackground'

function TwoChoiceModal({ title = "eDroplets", content, affirmativeText, negativeText, handleAffirmative, handleNegative }: { title?: string, content: string | React.ReactNode, affirmativeText: string, negativeText: string, handleAffirmative: () => void, handleNegative: () => void }) {

  const affirmative = useCallback(() => {
    handleAffirmative();
  }, [handleAffirmative]);

  const negative = useCallback(() => {
    handleNegative();
  }, [handleNegative]);
  
  return (
    <ModalBackground>
      <div className="flex flex-col bg-white rounded-lg shadow-box w-1/3 divide-y">
        <div className="p-4">
          <div className="">{title}</div>
        </div>
        <div className="p-4">
          {content}
        </div>
        <div className="p-4 flex justify-end space-x-4">
          <button id="affirmative" type="button" className="bg-primary_light hover:bg-primary rounded-md px-4 py-2 text-white" onClick={affirmative}>{affirmativeText}</button>
          <button id="negative" type="button" className="rounded-md px-4 py-2 bg-gray-200" onClick={negative}>{negativeText}</button>
        </div>
      </div>
    </ModalBackground >
  )
}

export default TwoChoiceModal