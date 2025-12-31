import { useState, useEffect, useRef } from 'react'

interface TypewriterOptions {
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
}

export function useTypewriter(
  textToType: string,
  { speed = 150, deleteSpeed = 100, pauseDuration = 2000 }: TypewriterOptions = {}
) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Use refs to keep track of state inside timeouts without dependency loops
  const index = useRef(0)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleTyping = () => {
      const currentIdx = index.current

      if (!isDeleting) {
        // Typing phase
        if (currentIdx < textToType.length) {
          setDisplayedText(textToType.substring(0, currentIdx + 1))
          index.current++
          timeoutRef.current = setTimeout(handleTyping, speed)
        } else {
          // Finished typing, pause before deleting
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true)
            handleTyping()
          }, pauseDuration)
        }
      } else {
        // Deleting phase
        if (currentIdx > 0) {
          setDisplayedText(textToType.substring(0, currentIdx - 1))
          index.current--
          timeoutRef.current = setTimeout(handleTyping, deleteSpeed)
        } else {
          // Finished deleting, loop back to typing
          setIsDeleting(false)
          timeoutRef.current = setTimeout(handleTyping, speed)
        }
      }
    }

    // Start the loop
    timeoutRef.current = setTimeout(handleTyping, speed)

    return () => clearTimeout(timeoutRef.current)
  }, [textToType, isDeleting, speed, deleteSpeed, pauseDuration])

  return displayedText
}