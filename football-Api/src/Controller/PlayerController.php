<?php

namespace App\Controller;

use App\Entity\Player;
use App\Repository\PlayerRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PlayerController extends AbstractController
{
    private $playerRepository;
    private $entityManager;

    public function __construct(PlayerRepository $playerRepository, EntityManagerInterface $entityManager)
    {
        $this->playerRepository = $playerRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/players', name: 'get_players', methods: ['GET'])]
    public function getPlayers(): JsonResponse
    {
        $players = $this->playerRepository->findAll();
        return $this->json($players, 200);
    }

    #[Route('/players/{id}', name: 'get_player', methods: ['GET'])]
    public function getPlayer(int $id): JsonResponse
    {
        $player = $this->playerRepository->find($id);
        if (!$player) {
            return $this->json(['error' => 'Player not found'], 404);
        }
        return $this->json($player, 200);
    }

    #[Route('/players', name: 'create_player', methods: ['POST'])]
    public function createPlayer(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $player = new Player();
        $player->setFirstName($data['firstName']);
        $player->setLastName($data['lastName']);
        $player->setPosition($data['position']);
        $player->setTeam($data['team']);
        $player->setAge($data['age']);
        $player->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($player);
        $this->entityManager->flush();
        return $this->json($player, 201);
    }

    #[Route('/players/{id}', name: 'update_player', methods: ['PUT'])]
    public function updatePlayer(Request $request, int $id): JsonResponse
    {
        $player = $this->playerRepository->find($id);
        if (!$player) {
            return $this->json(['error' => 'Player not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $player->setFirstName($data['firstName']);
        $player->setLastName($data['lastName']);
        $player->setPosition($data['position']);
        $player->setTeam($data['team']);
        $player->setAge($data['age']);
        $player->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $this->json($player, 200);
    }

    #[Route('/players/{id}', name: 'delete_player', methods: ['DELETE'])]
    public function deletePlayer(int $id): JsonResponse
    {
        $player = $this->playerRepository->find($id);
        if (!$player) {
            return $this->json(['error' => 'Player not found'], 404);
        }

        $this->entityManager->remove($player);
        $this->entityManager->flush();

        return $this->json(['message' => 'Player deleted successfully'], 200);
    }

    #[Route('/players/import', name: 'import_players', methods: ['POST'])]
    public function importPlayers(Request $request): JsonResponse
    {
        $file = $request->files->get('file');

        if (!$file instanceof UploadedFile) {
            return $this->json(['error' => 'No file uploaded'], 400);
        }

        try {

            $spreadsheet = IOFactory::load($file->getPathname());
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();


            foreach ($data as $row) {

                if (count($row) < 5) {
                    continue;
                }


                $player = new Player();
                $player->setFirstName($row[0] ?? '');
                $player->setLastName($row[1] ?? '');
                $player->setPosition($row[2] ?? '');
                $player->setTeam($row[3] ?? '');
                $player->setAge((int)($row[4] ?? 0));
                $player->setCreatedAt(new \DateTimeImmutable());


                $this->entityManager->persist($player);
            }


            $this->entityManager->flush();

            return $this->json(['message' => 'Players imported successfully'], 200);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error processing the file', 'message' => $e->getMessage()], 500);
        }
    }
}
