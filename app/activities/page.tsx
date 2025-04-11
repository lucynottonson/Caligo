'use client';

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/navbar';
import { supabase } from '@/lib/supabaseClient';

export default function ActivitiesPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [oneHighscore, setOneHighscore] = useState<number | null>(null);
  // A ref to always have the latest high score inside our p5 sketch
  const oneHighscoreRef = useRef<number | null>(oneHighscore);

  useEffect(() => {
    oneHighscoreRef.current = oneHighscore;
  }, [oneHighscore]);

  // Fetch the user's current high score ("one_highscore") from Supabase on mount
  useEffect(() => {
    async function fetchHighscore() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData) {
        console.error("User not found");
        return;
      }
      const user = userData.user;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('one_highscore')
        .eq('id', user.id)
        .single();
      if (profileError) {
        console.error("Error fetching highscore", profileError);
      } else {
        setOneHighscore(profileData.one_highscore);
      }
    }
    fetchHighscore();
  }, []);

  // p5 sketch integration with scoring and high score updates
  useEffect(() => {
    const sketch = (p: any) => {
      let x: number, y: number;
      const speed = 5;
      let score = 0;
      let gameOver = false;
      
      p.setup = () => {
        p.createCanvas(600, 400);
        x = p.width / 2;
        y = p.height / 2;
        score = 0;
      };
      
      p.draw = () => {
        if (!gameOver) {
          // Increase score over time (in seconds)
          score = Math.floor(p.millis() / 1000);
        }
        p.background(220);
        p.fill(0);
        p.ellipse(x, y, 50, 50);
        
        // Display the current score on the canvas
        p.fill(0);
        p.textSize(16);
        p.text(`Score: ${score}`, 10, 30);
      };

      p.keyPressed = () => {
        if (!gameOver) {
          if (p.keyCode === p.LEFT_ARROW) {
            x -= speed;
          } else if (p.keyCode === p.RIGHT_ARROW) {
            x += speed;
          } else if (p.keyCode === p.UP_ARROW) {
            y -= speed;
          } else if (p.keyCode === p.DOWN_ARROW) {
            y += speed;
          }
        }
        // Press 'G' or 'g' to end the game and submit the score
        if (p.key === 'g' || p.key === 'G') {
          gameOver = true;
          p.noLoop();
          submitScore(score);
        }
      };
    };

    // Function to update the user's high score in Supabase if the current score is higher
    const submitScore = async (score: number) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData) {
        console.error("User not found", userError);
        return;
      }
      const user = userData.user;
      // Only update if the new score is higher than the saved one_highscore
      if (oneHighscoreRef.current !== null && score <= oneHighscoreRef.current) {
        console.log("Score is not higher than your high score.");
        return;
      }
      const { error } = await supabase
        .from('profiles')
        .update({ one_highscore: score })
        .eq('id', user.id);
      if (error) {
        console.error("Error updating high score:", error);
      } else {
        console.log("High score updated!");
        setOneHighscore(score);
      }
    };

    if (canvasRef.current) {
      import('p5').then((p5Module) => {
        const p5 = p5Module.default;
        new p5(sketch, canvasRef.current);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Activities - One Game</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row md:space-x-4">
        <div ref={canvasRef} className="w-full md:w-2/3">
          {/* p5 canvas will render here */}
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <h2 className="text-xl font-bold">
            Current High Score: {oneHighscore !== null ? oneHighscore : 'Loading...'}
          </h2>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Press 'G' to end game and submit your score.</p>
    </div>
  );
}
