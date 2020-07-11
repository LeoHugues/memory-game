<?php

namespace App\Controller;

use App\Entity\Player;
use App\Entity\Score;
use App\Form\PlayerType;
use App\Form\ScoreType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    /**
     * @param Request $request
     *
     * @Route("/register", name="register_form", methods={"POST", "GET"})
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function ajaxRegesterForm(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $player = new Player();
        $form = $this->createForm(PlayerType::class, $player);

        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            /** @var Player $player */
            $player = $form->getData();

            $em->persist($player);
            $em->flush();

            return new JsonResponse(['id' => $player->getId(), 'name' => $player->getUsername()]);
        }

        return $this->render('memory_game/register.html.twig', array('form' => $form->createView()));
    }

    /**
     * @param Player $player
     * @param Request $request
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     * @Route("/score/{id}", name="form_save_score")
     */
    public function ajaxSaveScore(Player $player, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $score = new Score();
        $form = $this->createForm(ScoreType::class, $score);

        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            /** @var Score $score */
            $score = $form->getData();
            $score->setPlayer($player);

            $em->persist($score);
            $em->flush();

            return new JsonResponse(['status' => 'succes']);
        }

        return $this->render('memory_game/register.html.twig', array('form' => $form->createView()));
    }
}
