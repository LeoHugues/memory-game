<?php

namespace App\Entity;

use App\Repository\PlayerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=PlayerRepository::class)
 */
class Player
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @Groups("ajaxScore")
     */
    private $username;

    /**
     * @ORM\OneToMany(targetEntity=Score::class, cascade={"persist", "remove"}, mappedBy="player")
     */
    private $scores;

    public function __construct()
    {
        $this->scores = new ArrayCollection();
    }

    public function getScores()
    {
        return $this->scores;
    }

    public function addScore(Score $score)
    {
        $this->scores->add($score);
        $score->setPlayer($this);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }
}
