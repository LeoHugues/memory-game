<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class MemoryGameController extends AbstractController
{
    /**
     * @Route("/", name="memory_game")
     */
    public function index()
    {
        return $this->render('memory_game/index.html.twig', [
            'controller_name' => 'MemoryGameController',
        ]);
    }
}
